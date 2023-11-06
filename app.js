// (function () {
//     console.log("hello owl", owl.__info__.version);
// })();

function get_version() {
    if (owl) {
        return owl.__info__.version;
    } else {
        return 'Owl not found.'
    }
}

const { Component, mount, xml, useRef, onMounted, useState } = owl;

// Owl components

// ----------------
// Store
// ----------------
function useStore() {
    const env = useEnv();
    return useState(env.store);
}

// ----------------
// Task Component
// ----------------
class Task extends Component {
    static template = xml `
        <div class="task" t-att-class="props.task.is_completed ? 'done' : ''">
            <!-- field checkbox -->
            <input type="checkbox" t-att-checked="props.task.is_completed" t-on-click="toggle_task" />
            
            <!-- field text -->
            <span><t t-esc="props.task.text" /></span>
            
            <!-- delete button -->
            <span class="delete" t-on-click="delete_task">🗑</span>
        </div>
    `;

    static props = ["task", "onDelete"]

    delete_task() {
        this.props.onDelete(this.props.task)
    }

    toggle_task() {
        this.props.task.is_completed = !this.props.task.is_completed;
    }
}

// ----------------
// Root Component
// ----------------
class Root extends Component {
    static template = xml`
        <div>todo app</div>
        <input placeholder="Enter new task" t-on-keyup="add_task" t-ref="add-input" />
        <div class="task-list">
            <t t-foreach="task_list" t-as="task_item" t-key="task_item.id">
                <Task task="task_item" onDelete.bind="delete_task" />
            </t>
        </div>
    `;
    static components = { Task }

    // task_list = [
    //     {
    //         id: 1, text: "buy milk", is_completed: true
    //     },
    //     {
    //         id: 2, text: "buy eggs", is_completed: false
    //     }
    // ]

    // statically initialize task_list
    // task_list = [];

    // add watcher to task_list variable so that view is re-rendered after every update on task_list.
    task_list = useState([])

    next_id = 1;

    add_task(ev) {
        // 13 is keycode for ENTER
        if (ev.keyCode === 13) {
            const text = ev.target.value.trim();
            ev.target.value = "";
            console.log("adding task " + text);
            if (text) {
                const new_task = {
                    id: this.next_id,
                    text: text,
                    is_completed: false,
                };
                this.next_id += 1;
                this.task_list.push(new_task)
            }

        }
    }

    delete_task(task_to_delete) {
        const index = this.task_list.findIndex(t => t.id === task_to_delete.id)
        this.task_list.splice(index, 1)
    }

    setup() {
        const input_reference = useRef("add-input");
        onMounted(
            () => input_reference.el.focus()
        );
    }
}


mount(Root, document.body, {dev: true})