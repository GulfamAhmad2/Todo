import { useReducer, useState } from 'react'
import { BiSolidUpArrowSquare } from "react-icons/bi";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { MdFileDownloadDone } from "react-icons/md";
import { MdOutlineDoneOutline } from "react-icons/md";
import { RxCross2 } from "react-icons/rx";
import { BsThreeDotsVertical } from "react-icons/bs";


/* ============== ENUM ============== */
export const TYPES = Object.freeze({
    AddTodo: 'addTodo',
    DELETE: 'delete',
    COMPLETE: 'complete',
    EDIT: 'edit',
    EDIT_DONE: 'editDone',
    CANCEL_EDIT: 'editDiscarded',
    TOGGLE_CHECK: 'toggleCheck',
    DELETE_ROW: 'delete-all-row',
    SHOW_OPTION:'showOption'

});

/* ============== Data ============== */
function newTodo(data) {
    return {
        id: Date.now(),
        data: data,
        complete: false,
        edit: false,
        editDone: false,
        editDiscarded: false,
        isSelected: false,
        showOptions:false,
    }
};

/* ============== Reducer function ============== */
const reducer = (state, action) => {
    switch (action.type) {
        /* ============== Add new list in array ============== */
        case TYPES.AddTodo:
            return [...state, newTodo(action.payload)];
            
        /* ============== Delete data from array ============== */
        case TYPES.DELETE:
            return state.filter((del) => del.id !== action.payload);

        /* ============== Complete task button ============== */
        case TYPES.COMPLETE:
            return state.map((toggle) => toggle.id === action.payload ? { ...toggle, complete: !toggle.complete, showOptions:false } : toggle);

        /* ============== Open edit input button ============== */
        case TYPES.EDIT:
            return state.map((editItem) => editItem.id === action.payload ? { ...editItem, edit: !editItem.edit, showOptions:false } : editItem);

        /* ============== Update exiting data button ============== */
        case TYPES.EDIT_DONE:
            return state.map((editComplete) => editComplete.id === action.payload.id ? { ...editComplete, data: action.payload.data, edit: false, } : editComplete);

        /* ============== Update cancel button ============== */
        case TYPES.CANCEL_EDIT:
            return state.map((discarded) => discarded.id === action.payload ? { ...discarded, edit: false } : discarded);

        /* ============== Toggle row checkbox ============== */
        case TYPES.TOGGLE_CHECK:
            return state.map((toggleCheck) => toggleCheck.id === action.payload ? { ...toggleCheck, isSelected: !toggleCheck.isSelected } : toggleCheck);

        /* ============== Delete checked rows ============== */
        case TYPES.DELETE_ROW:
            return state.filter((item) => item.isSelected !== true);

            case TYPES.SHOW_OPTION:
                return state.map((showButtons) => showButtons.id === action.payload ? { ...showButtons, showOptions: !showButtons.showOptions } : showButtons);
        /* ============== Default State ============== */
        default:
            return state;
    };

}

const Todo = () => {
    /* ============== useReducer Hook ============== */
    const [state, dispatch] = useReducer(reducer, []);

    /* ============== Getting Todo values ============== */
    const [todoValue, setTodoValue] = useState("");

    /* ============== Getting todo updated values ============== */
    const [editValue, setEditValue] = useState('');

    /* ============== Count todo value ============== */
    const totalValue = state.reduce((item) => item += + 1, 0);

    /* ============== handle add button ============== */
    const handleButton = (e) => {
        e.preventDefault();
        dispatch({ type: TYPES.AddTodo, payload: todoValue })
        setTodoValue('')
    };

    return (
        <div className='todo-wrapper' >
        {/*  ============== Top container including todo input and button ============== */ }
            <div className='todo-input-container' >
                <input autoCorrect='true' value={todoValue} autoComplete='true' autoFocus placeholder='write your todo' type='text' onChange={e => setTodoValue(e.target.value)} />
                <form onSubmit={handleButton}>
                    <button type='submit' disabled={todoValue === ""} >
                        <span>ADD</span>
                        <BiSolidUpArrowSquare />
                    </button>
                </form>
            </div>
        {/*  ============== Top List container including count value and delete button ============== */ }
            <div className='todo-list-wrapper' >
                <div className='todo-header'>
                    <div className='todo-header-left' >
                        <span>Todo List</span>
                        <span>{totalValue}</span>
                    </div>
                    <div className='todo-header-right'>
                        <MdDelete onClick={() => dispatch({ type: TYPES.DELETE_ROW })} />
                    </div>
                </div>
                <div className='todo-row-wrapper' >
                    {
                        state?.map((items) => {
                            return (
                                <div className='data-row' key={items.id} >

                                {/*  ============== List left side and include checkbox, todoValues, editInput, submit and reject button ============== */ }
                                    <div className='data-row-left' >
                                        <input type='checkbox' id='check' checked={items.isSelected} onChange={() => dispatch({ type: TYPES.TOGGLE_CHECK, payload: items.id })} />
                                        <label hidden={items.edit} >{items.data}</label>
                                        <div className='editInput' hidden={!items.edit}>
                                            <input autoFocus type='text' defaultValue={items.data} onChange={e => setEditValue(e.target.value)} />
                                            <RxCross2 onClick={() => dispatch({ type: TYPES.CANCEL_EDIT, payload: items.id })} />
                                            <MdOutlineDoneOutline onClick={() => dispatch({ type: TYPES.EDIT_DONE, payload: { data: editValue, id: items.id } })} />
                                        </div>
                                    </div>
                                    <div className='data-row-right-icons' >
                                     {/*  ============== List right side and include editButton, deleteSingle row button and complete button ============== */ }
                                        <span className={`todoStatus ${!items.complete ? "pending" : "completed"} `} >{!items.complete ? "Pending" : "Completed"}</span>
                                        <BsThreeDotsVertical className='showOption' onClick={() => dispatch({type: TYPES.SHOW_OPTION, payload:items.id})} />
                                        <div className={`${items.showOptions ? "active" : ""} `} >
                                            <FaEdit onClick={() => dispatch({ type: TYPES.EDIT, payload: items.id })} />
                                        <MdDelete onClick={() => dispatch({ type: TYPES.DELETE, payload: items.id })} />
                                        <MdFileDownloadDone onClick={() => dispatch({ type: TYPES.COMPLETE, payload: items.id })} />
                                        </div>
                                        
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
            </div>
        </div>
    )
}

export default Todo;