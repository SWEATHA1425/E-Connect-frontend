<<<<<<< HEAD
import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import axios from "axios";
import { ipadr, LS } from "../Utils/Resuse";
import { Modal } from "./Modal";
import { createPortal } from "react-dom";
import Multiselect from 'multiselect-react-dropdown';
import { RotateCw } from "lucide-react";
import { toast } from "react-toastify";
import { parseISO, isWithinInterval } from 'date-fns';
import { AiOutlineDelete, AiOutlineEdit } from 'react-icons/ai';

// ConfirmModal: a self-contained modal (does not use the existing Modal component)
function ConfirmModal({ open, title, message, onConfirm, onClose, confirmLabel = 'Delete', cancelLabel = 'Cancel' }) {
  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (e.key === 'Escape') onClose?.();
      if (e.key === 'Enter') onConfirm?.();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open, onClose, onConfirm]);

  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-lg shadow-lg w-full max-w-md mx-4">
        <div className="p-5">
          <div className="flex items-start gap-4">
            <div className="p-2 rounded-full bg-red-100 text-red-600 flex items-center justify-center">
              <AiOutlineDelete className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
              <p className="text-sm text-gray-600 mt-1">Are you sure you want to delete this task?</p>
              {message && <p className="text-xs text-gray-500 mt-2 break-words">{message}</p>}
            </div>
          </div>
          <div className="mt-6 flex justify-end gap-3">
            <button onClick={onClose} className="px-3 py-1 rounded-md border border-gray-300 bg-white text-gray-700">{cancelLabel}</button>
            <button autoFocus onClick={onConfirm} className="px-3 py-1 rounded-md bg-red-600 text-white hover:bg-red-700 shadow">{confirmLabel}</button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}

// Note Component
// Note Component
const Note = ({ empdata, handleDelete, handleEdit }) => (
  <div
    className={`
      relative p-4 w-full flex flex-col justify-between rounded-xl 
      shadow-sm border border-blue-200 bg-blue-50 transition-all duration-200 transform
      hover:scale-[1.02] hover:shadow-lg hover:z-20 cursor-pointer
    `}
  >
    {/* Status indicator line */}
    <div
      className={`absolute top-2 left-1/2 transform -translate-x-1/2 w-12 h-1 rounded-full ${
        empdata.status === 'Completed'
          ? 'bg-green-500'
          : empdata.status === 'In Progress'
          ? 'bg-blue-500'
          : 'bg-red-500'
      }`}
    />

    {/* Verified badge (top-right) */}
    {empdata.verified && (
      <div className="absolute top-2 right-2">
        <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-green-700 text-white">Verified</span>
      </div>
    )}
    <div className="mt-2 flex flex-col gap-2">
      <div className="max-h-20 overflow-y-auto">
  <h3 className="text-lg font-semibold text-gray-800 whitespace-pre-wrap break-words">
    📝 {Array.isArray(empdata.task) ? empdata.task[0] : empdata.task}
  </h3>
</div>


      <ul className="text-sm text-gray-700 space-y-1">
        <li><span className="font-semibold">Assigned:</span> {empdata.date}</li>
        <li><span className="font-semibold">Due:</span> {empdata.due_date ? String(empdata.due_date).slice(0, 10) : "-"}</li>
        <li>
          <span className="font-semibold">Status:</span>
          <span className={`ml-2 px-2 py-0.5 text-xs font-medium rounded-full ${
            empdata.status === 'Completed'
              ? 'bg-green-100 text-green-700'
              : empdata.status === 'In Progress'
              ? 'bg-blue-100 text-blue-800'
              : 'bg-red-100 text-red-700'
          }`}>
            {empdata.status}
          </span>
        </li>
        <li><span className="font-semibold">Assigned By:</span> {empdata.assigned_by}</li>
        <li>
          <span className="font-semibold">Priority:</span>
          <span className={`ml-2 px-2 py-0.5 text-xs font-medium rounded-full bg-yellow-100 text-yellow-700 border ${
            empdata.priority === 'High'
              ? 'border-red-500'
              : empdata.priority === 'Medium'
              ? 'border-blue-500'
              : 'border-green-500'
          }`}>
            {empdata.priority}
          </span>
        </li>
      </ul>

      {empdata.subtasks?.length > 0 && (
        <div className="mt-2 border-t pt-2">
          <p className="font-medium text-gray-800 text-sm mb-1">Subtasks:</p>
          <ul className="text-xs text-gray-600 max-h-24 overflow-y-auto assigntask-thin-scrollbar space-y-1">
            {empdata.subtasks.map((sub, i) => (
              <li key={i} className="flex items-center gap-1">
                <span className={`${sub.completed ? 'text-green-500' : 'text-gray-400'}`}>
                  {sub.completed ? '✓' : '○'}
                </span>
                <span className={`${sub.completed ? 'line-through text-gray-500' : ''} break-words`}>
                  {sub.title || sub.text}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>

    <div className="flex justify-end gap-2 mt-3">
      <button
        onClick={() => {
          if (empdata.verified) return toast.error('This task is verified and cannot be edited.');
          handleEdit(empdata.taskid || empdata._id || empdata.id);
        }}
        className={`p-2 rounded-lg ${empdata.verified ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-green-50 hover:bg-green-100 text-green-700'} transition`}
      >
        <AiOutlineEdit className="text-xl" />
      </button>
      <button
        onClick={() => {
          if (empdata.verified) return toast.error('This task is verified and cannot be deleted.');
          handleDelete(empdata.taskid || empdata._id || empdata.id);
        }}
        className={`p-2 rounded-lg ${empdata.verified ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-red-50 hover:bg-red-100 text-red-700'} transition`}
      >
        <AiOutlineDelete className="text-xl" />
      </button>
    </div>
  </div>
);




const TaskAssign = ({ assignType }) => {
  // small client-side injection for thinner scrollbars (WebKit + Firefox)
  useEffect(() => {
    if (typeof document === 'undefined') return;
    if (document.getElementById('assigntask-scrollbar-style')) return;
    const style = document.createElement('style');
    style.id = 'assigntask-scrollbar-style';
    style.innerHTML = `
      /* Firefox */
      .assigntask-thin-scrollbar { scrollbar-width: thin; }
      /* WebKit browsers */
      .assigntask-thin-scrollbar::-webkit-scrollbar { height: 8px; width: 8px; }
      .assigntask-thin-scrollbar::-webkit-scrollbar-thumb { background: rgba(100,116,139,0.35); border-radius: 9999px; }
      .assigntask-thin-scrollbar::-webkit-scrollbar-track { background: transparent; }
    `;
    document.head.appendChild(style);
  }, []);

  const [deleteTarget, setDeleteTarget] = useState(null); // { id, title }
  const navigate = useNavigate();
  const params = useParams();
  const [searchParams] = useSearchParams();
  const [employeeData, setEmployeeData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8);
  const [modalOpen, setModalOpen] = useState(false);
  const [editModel, SetEditmodel] = useState([]);
  const [modeldata, setModelData] = useState({ task: [""], userid: "", date: "", due_date: "", priority: "Medium", subtasks: [] });
  const [options, SetOptions] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [ValueSelected, SetValueSelected] = useState('');
  const [dateRange, setDateRange] = useState([{ startDate: null, endDate: null, key: "selection" }]);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [itemsToShow, setItemsToShow] = useState(8); 
  const [searchTerm, setSearchTerm] = useState('');


  // Determine role and API endpoints
  const isManager = assignType === 'manager-to-employee';
  const isHR = assignType === 'hr-to-manager';
  // Filter tasks by dropdown selection
  useEffect(() => {
    if (!ValueSelected) {
      setFilteredData(employeeData);
      return;
    }
    // Find the selected user object
    const selectedUser = options.find(opt => String(opt.userid) === String(ValueSelected));
    if (!selectedUser) {
      setFilteredData(employeeData);
      return;
    }
    // Filter tasks where assigned_to, assigned_to_name, or userid matches
    const filtered = employeeData.filter((task) => {
      // Some APIs may use assigned_to, assigned_to_name, or userid
      if (Array.isArray(task.assigned_to)) {
        if (task.assigned_to.includes(selectedUser.name) || task.assigned_to.includes(selectedUser.userid)) return true;
      }
      if (task.assigned_to && (task.assigned_to === selectedUser.name || task.assigned_to === selectedUser.userid)) return true;
      if (task.assigned_to_name && (task.assigned_to_name === selectedUser.name || task.assigned_to_name === selectedUser.userid)) return true;
      if (task.userid && String(task.userid) === String(selectedUser.userid)) return true;
      return false;
    });
    setFilteredData(filtered);
  }, [ValueSelected, employeeData, options]);

const sortedData = [...filteredData].reverse(); // newest first

// Apply search filter
const searchedData = sortedData.filter(task => {
  let title = task.task;

  // If task.task is an array, take the first element
  if (Array.isArray(title)) title = title[0];

  // Ensure it's a string
  if (typeof title !== 'string') return false;

  return title.toLowerCase().includes(searchTerm.toLowerCase());
});


// Slice for pagination / load more
const currentItems = searchedData.slice(0, itemsToShow);

const handlePageChange = (direction) => {
  if (direction === "prev" && currentPage > 1) {
    setCurrentPage(currentPage - 1);
  } else if (direction === "next" && currentPage < totalPages) {
    setCurrentPage(currentPage + 1);
  }
};




  // Fetch options for dropdown (employees for manager, managers for HR)
  useEffect(() => {
    const fetchOptions = async () => {
      try {
        if (isManager) {
          const res = await axios.get(`${ipadr}/get_team_members?TL=${LS.get('name')}`);
          SetOptions(res.data && Array.isArray(res.data) ? res.data : []);
        } else if (isHR) {
          const res = await axios.get(`${ipadr}/get_manager`);
          SetOptions(res.data && Array.isArray(res.data) ? res.data : []);
        }
      } catch {
        SetOptions([]);
      }
    };
    fetchOptions();
  }, [isManager, isHR]);

  // Fetch tasks for the current view
  useEffect(() => {
    fetchTasks();
  }, [assignType]);

  const fetchTasks = async () => {
    setLoading(true);
    setError('');
    try {
      let url = '';
      if (isManager) {
        url = `${ipadr}/get_assigned_task?TL=${LS.get('name')}&manager_id=${LS.get('id')}`;
      } else if (isHR) {
        // HR should fetch all managers and their tasks
        url = `${ipadr}/get_manager`;
        const res = await axios.get(url);
        const managers = Array.isArray(res.data) ? res.data : [res.data];
        let allTasks = [];
        for (const manager of managers) {
          if (!manager.userid) continue;
          const taskRes = await axios.get(`${ipadr}/get_manager_hr_tasks/${manager.userid}`);
          if (Array.isArray(taskRes.data)) {
            allTasks = allTasks.concat(taskRes.data);
          }
        }
        setEmployeeData(allTasks);
        setFilteredData(allTasks);
        setLoading(false);
        return;
      }
      const res = await axios.get(url);
      const data = res.data && Array.isArray(res.data) ? res.data : [];
      setEmployeeData(data);
      setFilteredData(data);
    } catch (err) {
      setEmployeeData([]);
      setFilteredData([]);
      setError("Error while fetching tasks");
    } finally {
      setLoading(false);
    }
  };

  // Handle Add/Edit/Delete
  const handleDelete = async (taskId) => {
    if (!taskId) return toast.error("Invalid task ID");
    try {
      const response = await fetch(`${ipadr}/task_delete/${taskId}`, { method: "DELETE", headers: { "Content-Type": "application/json" } });
      const data = await response.json();
      if (!response.ok) throw new Error(data.detail || "Failed to delete task");
      toast.success("Task deleted successfully!");
      fetchTasks();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleEdit = async (id) => {
    try {
      const response = await axios.get(`${ipadr}/get_single_task/${id}`);
      const taskdetails = response.data;
      let actualTaskData = Array.isArray(taskdetails) ? taskdetails[0] : (taskdetails.task || taskdetails);
      // If the task is verified, prevent editing from AssignTask UI
      if (actualTaskData.verified) {
        return toast.error('This task is verified and cannot be edited.');
      }
      // Ensure comments and files are present for later preservation
      SetEditmodel([{ 
        ...actualTaskData, 
        subtasks: normalizeSubtasks(actualTaskData.subtasks || []),
        comments: actualTaskData.comments || [],
        files: actualTaskData.files || []
      }]);
      setModalOpen(true);
    } catch (error) {
      toast.error("Error fetching task details");
    }
  };

  // Normalize subtasks
  const normalizeSubtasks = (subtasks) => (Array.isArray(subtasks) ? subtasks.map((s, idx) => ({ id: s.id || `subtask_${Date.now()}_${idx}_${Math.random()}`, title: s.title || s.text || "", text: s.text || s.title || "", completed: s.completed ?? s.done ?? false, done: s.done ?? s.completed ?? false })) : []);

  // Add/Edit Task
  const handleonSubmit = async () => {
    if (!modeldata.task.some(task => task.trim() !== "")) return toast.error("Task title is required");
    if (!modeldata.due_date) return toast.error("Due date is required");
    if ((isManager || isHR) && selectedUsers.length === 0) return toast.error(isManager ? "Please select an employee" : "Please select a manager");
    let taskArr = [];
  // Always format due_date as yyyy-mm-dd for the input
    const formatDate = (dateStr) => {
      if (!dateStr) return "";
      // If already yyyy-mm-dd, return as is
      if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return dateStr;
      // If dd-mm-yyyy or dd/mm/yyyy, convert
      const parts = dateStr.split(/[-\/]/);
      if (parts.length === 3 && parts[2].length === 4) {
        // dd-mm-yyyy to yyyy-mm-dd
        return `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
      }
      return dateStr;
    };
    try {
      // Defensive: don't allow creating/updating if modeldata indicates a verified flag
      if (modeldata.verified) return toast.error('This task is verified and cannot be edited.');
      for (let i = 0; i < selectedUsers.length; i++) {
        const taskdetails = {
          Tasks: modeldata.task,
          userid: selectedUsers?.[i]?.userid,
          assigned_by: LS.get("name"),
          date: new Date().toISOString().split("T")[0],
        due_date: formatDate(modeldata.due_date),
          priority: modeldata.priority || "Medium",
          subtasks: normalizeSubtasks(modeldata.subtasks || []),
        };
        taskArr.push(taskdetails);
      }
      const response = await axios({ method: "post", url: `${ipadr}/task_assign_to_multiple_members`, data: { Task_details: taskArr }, headers: { "Content-Type": "application/json" } });
      if (response.status === 200) {
        toast.success(isManager ? "Task assigned to employee(s)" : "Task assigned to manager(s)");
        setModelData({ task: [""], userid: "", date: "", due_date: "", priority: "Medium", subtasks: [] });
        setSelectedUsers([]);
        setModalOpen(false);
        // Ensure fields are cleared after modal closes
        setTimeout(() => {
          setModelData({ task: [""], userid: "", date: "", due_date: "", priority: "Medium", subtasks: [] });
          setSelectedUsers([]);
        }, 300);
        fetchTasks();
      } else {
        toast.error("Error while adding the task");
      }
    } catch (error) {
      toast.error("Error submitting task");
    }
  };

const handleoneditSubmit = async () => {
  try {
    if (!editModel || editModel.length === 0) return toast.error("No task data to update");
    const item = editModel[0];
    if (item.verified) return toast.error('This task is verified and cannot be edited.');

    // Always format due_date as yyyy-mm-dd
    const formatDate = (dateStr) => {
      if (!dateStr) return "";
      if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return dateStr;
      const parts = dateStr.split(/[-\/]/);
      if (parts.length === 3 && parts[2].length === 4) {
        return `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
      }
      return dateStr;
    };

    const updatedetails = {
      updated_task: Array.isArray(item.task) ? item.task[0] : item.task,
      userid: item.userid,
      status: item.status,
      due_date: formatDate(item.due_date),
      priority: item.priority || "Medium",
      taskid: item._id,
      subtasks: normalizeSubtasks(item.subtasks || []),
      // Preserve comments and files even if not shown in UI
      comments: item.comments || [],
      files: item.files || []
    };

    const response = await axios({
      method: 'put',
      url: `${ipadr}/edit_task`,
      data: updatedetails,
      headers: { 'Content-Type': 'application/json' }
    });

    if (response.status === 200) {
      toast.success("Task edited successfully");
      setModalOpen(false);
      SetEditmodel([]);
      setModelData({ task: [""], userid: "", date: "", due_date: "", priority: "Medium", subtasks: [] });
      setSelectedUsers([]);
      fetchTasks();
    } else {
      toast.error("Error while editing the task");
      console.error("Edit task error response:", response);
    }
  } catch (error) {
    toast.error("Error editing task");
  }
};

  // UI
  if (loading) return <div className="flex justify-center items-center h-64 text-xl">Loading tasks...</div>;
  if (error) return <div className="flex justify-center items-center h-64 text-xl text-red-500">Error: {error}</div>;

  return (
    <div className="mr-8 p-4 bg-white min-h-screen w-full shadow-black rounded-xl relative jsonback ml-10 rounded-md h-screen flex flex-col overflow-hidden">
      <div className="flex items-center justify-between mb-1 px-2 py-2">
        <h1 className="text-2xl md:text-3xl font-semibold">Task Assign</h1>
        <button onClick={() => navigate(isManager ? '/User/manager-employee' : '/User/hr-manager')} className="px-3 py-1 bg-blue-700 text-white rounded-md text-sm">← Back To Dashboard</button>
      </div>
      <header className="sticky top-0 z-40 bg-white border-b border-gray-200 px-3 py-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <button className="bg-blue-500 text-white text-sm px-3 py-1 rounded-md" onClick={() => setModalOpen(true)}>Add Task</button>
          </div>
          <div className="flex-1 flex items-center justify-center space-x-3">
            <select className="w-40 p-1 text-sm border border-gray-300 rounded-md" value={ValueSelected} onChange={e => SetValueSelected(e.target.value)}>
              <option value="" disabled hidden>--select {isManager ? 'Employee' : 'Manager'}--</option>
=======
import React,{useState,useEffect} from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { ipadr,LS } from "../Utils/Resuse";
import { Modal } from "./Modal";
import { createPortal } from "react-dom";
import { FaEdit } from "react-icons/fa";
import { toast,ToastContainer } from "react-toastify";
import Multiselect from 'multiselect-react-dropdown';
import { FaCheck } from "react-icons/fa"; 
import { DateRangePicker } from "react-date-range";
import { format, isWithinInterval, parseISO } from 'date-fns';
import { useParams } from 'react-router-dom';
import { ArrowUp, ArrowDown, ArrowUpDown, RotateCw } from "lucide-react";
import { AiOutlineDelete, AiOutlineEdit } from 'react-icons/ai';

// Note Component
const Note = ({ empdata, handleDelete, handleEdit }) => {
  return (
    <div
    className={`${
      empdata.bg ? empdata.bg : 'bg-green-300'
    } p-6 pt-12 w-[320px] min-h-[250px] relative flex flex-col 
      rounded-lg shadow-xl border-l-[10px] border-grey-500 
      transition-all transform hover:rotate-2 hover:-translate-y-1 
      hover:shadow-white-400 hover:shadow-md animate-fade-in`}
  >
    {/* Sticky Tape Effect */}
    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-6 bg-gray-400 opacity-30 rounded-b-lg"></div>
  
    {/* Task Details */}
    <p className="text-gray-900 font-bold text-xl mb-3 text-center">📝 Task Details</p>
    <ul className="text-gray-800 text-base space-y-2">
      <li><span className="font-semibold">Task:</span> {empdata.task}</li>
      <li><span className="font-semibold">Assigned Date:</span> {empdata.date}</li>
      <li><span className="font-semibold">Due Date:</span> {empdata.due_date}</li>
      <li>
        <span className="font-semibold">Status:</span> 
        <span className={`ml-2 px-3 py-1 text-xs font-bold rounded-full shadow-md 
          ${empdata.status === 'Completed' ? 'bg-green-500 text-white' : 
          empdata.status === 'Pending' ? 'bg-yellow-500 text-black' : 
          'bg-red-500 text-white'}`}>
          {empdata.status}
        </span>
      </li>
      {/* <li>
        <span className="font-semibold">Assigned By:</span>{" "}
        {empdata.TL ? empdata.TL : "Self"}
      </li> */}
      <li>
  <span className="font-semibold">Assigned By:</span>{" "}
  {empdata.assigned_by && empdata.assigned_by !== "self"
    ? empdata.assigned_by
    : "Self"}
</li>
<li>
  
  <span className="font-semibold">Priority:</span>{" "}
  <span className={`ml-2 px-3 py-1 text-xs font-bold rounded-full shadow-md
    ${empdata.priority === "High" ? "bg-red-500 text-white" :
      empdata.priority === "Medium" ? "bg-yellow-400 text-black" :
      "bg-green-400 text-black"}`}>
    {empdata.priority}
  </span>
</li>

{empdata.subtasks.map((subtask, idx) => {
  const text = subtask.text ?? subtask.title ?? "";
  const completed = subtask.completed || false;
  
  // Create a unique key for each subtask
  const subtaskKey = `subtask-${empdata._id || empdata.id || empdata.taskid}-${idx}`;

  return (
    <div key={subtaskKey} className="flex items-center text-sm">
      <span className={`mr-2 ${completed ? 'text-green-500' : 'text-gray-400'}`}>
        {completed ? '✓' : '○'}
      </span>
      <span className={completed ? 'line-through text-gray-500' : ''}>
        {text}
      </span>
    </div>
  );
})}

    </ul>

    {/* Action Buttons with Floating Effect */}
{(LS.get("position") === "Manager" || empdata.assigned_by === "self") && (
  <div className="absolute top-2 right-4 flex gap-2">
    <button
      className="bg-green-600 text-white p-2 rounded-full shadow-lg transition-transform transform hover:scale-110 hover:-rotate-6 hover:shadow-green-500"
      onClick={() => handleEdit(empdata.taskid || empdata._id || empdata.id)}
    >
      <AiOutlineEdit className="text-xl" />
    </button>
    <button
      className="bg-red-600 text-white p-2 rounded-full shadow-lg transition-transform transform hover:scale-110 hover:rotate-6 hover:shadow-red-500"
      onClick={() => handleDelete(empdata.taskid || empdata._id || empdata.id)}
    >
      <AiOutlineDelete className="text-xl" />
    </button>
  </div>
)}

  </div>
  );
};

const TaskAssign=()=>{
     const [employeeData, setEmployeeData] = useState([]);
     const [taskData,SetTaskData]=useState([]);
     const [loading, setLoading] = useState(false);
     const [error,setError]=useState('');
     const [currentPage, setCurrentPage] = useState(1);
     const [itemsPerPage, setItemsPerPage] = useState(5);
    const [openmodel,SetOpenmodel]=useState(false)
    const [modalOpen, setModalOpen] = useState(false);
    const [selectone,SetSelectone]=useState({});
    const [allselect,SetAllSelect]=useState({});
    const[tempdata,SetTempdata]=useState({});
    const[options,SetOptions]=useState([]);
    const [priorityFilter, setPriorityFilter] = useState("all");
    const [assignedByFilter, setAssignedByFilter] = useState("all"); 

    const [viewMode, setViewMode] = useState('personal'); // 'personal' or 'assigned'
const [personalTasks, setPersonalTasks] = useState([]);
const [assignedTasks, setAssignedTasks] = useState([]);

     
      const [selectedValue, setSelectedValue] = useState('');
      const [ValueSelected,SetValueSelected]=useState('');
      const [selectedUsers, setSelectedUsers] = useState([]);

      const [hrPersonalTasks, setHrPersonalTasks] = useState([]);
const [hrAssignedTasks, setHrAssignedTasks] = useState([]);

      const [showDatePicker, setShowDatePicker] = useState(false);
      const [dateRange, setDateRange] = useState([
          {
            startDate: null,
            endDate: null,
            key: "selection",
          },
        ]);
      const [filteredData, setFilteredData] = useState([]);
       const [sortConfig, setSortConfig] = useState({
          column: null,
          direction: 'asc'
        });

    const [editModel,SetEditmodel]=useState([]);

    const[modeldata,setModelData]=useState({
        task:[""],
          userid:"",
          date:"",
          due_date:"",
          TL:"",
          priority: "Medium",
          subtasks:[]
    })
    
    const getManager = async() => {
    if (!isHR) return;
    
    try {
        const response = await axios.get(`${ipadr}/get_manager`); // Single manager endpoint
        const managerDetails = response.data ? [response.data] : []; // Wrap single manager in array for consistency
        console.log("managerDetails", managerDetails);
        SetOptions(managerDetails);
    } catch (error) {
        console.error("Error fetching manager:", error);
        SetOptions([]);
    }
}

    const isManager=LS.get('position')==="Manager"? true:false;
    const isHR=LS.get('position')==="HR"? true:false;

    // Fixed parameter extraction
    const params = useParams();
    let userid = params.userid;
    
    // Handle the case where userid is the string "undefined"
    if (userid === 'undefined' || !userid) {
        userid = LS.get('id'); // Use logged-in user's ID as fallback
    }

    console.log("userid:",userid);
    console.log("isManager:",isManager);
    // console.log("params:",params);
    // console.log("LS user id:", LS.get('id'));
    
     let url=''

     if(isManager) {
      url=`${ipadr}/get_assigned_task?TL=${LS.get('name')}&manager_id=${LS.get('id')}`;
     } 
  //   
  else {
      url=`${ipadr}/get_tasks/${userid}`
     }

     useEffect(()=>{
    fetchEmpdata();
    if(isManager) {
        users();
    } else if(isHR) {
        getManager(); // Add this line
    }
},[userid])
     
  const fetchEmpdata = async() => {
  try {
    setLoading(true);
    setError('');
    
    if (isManager) {
      // Existing manager logic
      const selfResponse = await axios.get(`${ipadr}/get_tasks/${LS.get('id')}`);
      const selfTasks = selfResponse.data && Array.isArray(selfResponse.data) ? selfResponse.data : [];
      
      const assignedResponse = await axios.get(`${ipadr}/get_assigned_task?TL=${LS.get('name')}`);
      const managerAssignedTasks = assignedResponse.data && Array.isArray(assignedResponse.data) ? assignedResponse.data : [];
      
      const employeeAssignedTasks = managerAssignedTasks.filter(task => task.userid !== LS.get('id'));
      
      setPersonalTasks(selfTasks);
      setAssignedTasks(employeeAssignedTasks);
      
      if (viewMode === 'personal') {
        setEmployeeData(selfTasks);
        setFilteredData(selfTasks);
      } else {
        setEmployeeData(employeeAssignedTasks);
        setFilteredData(employeeAssignedTasks);
      }
    } else if (isHR) {
      
       // Fix: Use HR name instead of ID for assigned tasks
      const selfResponse = await axios.get(`${ipadr}/get_hr_self_tasks/${LS.get('id')}`);
      const selfTasks = selfResponse.data && Array.isArray(selfResponse.data) ? selfResponse.data : [];
      
      // CORRECTED: Use HR name to get tasks assigned BY HR
      const assignedResponse = await axios.get(`${ipadr}/get_manager_hr_tasks/${LS.get('id')}`);
      const hrAssignedTasks = assignedResponse.data && Array.isArray(assignedResponse.data) ? assignedResponse.data : [];
      console.log("tasks:",hrAssignedTasks);
      // Filter to exclude HR's own tasks from assigned list
      const managerAssignedTasks = hrAssignedTasks.filter(task => task.userid !== LS.get('id'));
      
      setHrPersonalTasks(selfTasks);
      setHrAssignedTasks(hrAssignedTasks);
      
      if (viewMode === 'personal') {
        setEmployeeData(selfTasks);
        setFilteredData(selfTasks);
      } else {
        setEmployeeData(managerAssignedTasks);
        setFilteredData(managerAssignedTasks);
      }
    } else {
      // For employees, use the existing logic
      const response = await axios.get(url);
      const Empdata = response.data && Array.isArray(response.data) ? response.data : [];
      setEmployeeData(Empdata);
      setFilteredData(Empdata);
    }
    
    setLoading(false);
  } catch(error) {
    console.error("Error fetching data:", error);
    setLoading(false);
    setEmployeeData([]);
    setFilteredData([]);
    setError("Error while fetching tasks");
  }
}

useEffect(() => {
  if (isManager) {
    if (viewMode === 'personal') {
      setEmployeeData(personalTasks);
      setFilteredData(personalTasks);
    } else {
      setEmployeeData(assignedTasks);
      setFilteredData(assignedTasks);
    }
    setCurrentPage(1);
  } else if (isHR) {
    if (viewMode === 'personal') {
      setEmployeeData(hrPersonalTasks);
      setFilteredData(hrPersonalTasks);
    } else {
      setEmployeeData(hrAssignedTasks);
      setFilteredData(hrAssignedTasks);
    }
    setCurrentPage(1);
  }
}, [viewMode, personalTasks, assignedTasks, hrPersonalTasks, hrAssignedTasks]);
   // 🔹 Filter by Assigned By (employee only)
  // useEffect(() => {
  //   if (!isManager) {
  //     if (selectedValue === "all") {
  //       setFilteredData(employeeData);
  //     } else if (selectedValue === "self") {
  //        setFilteredData(employeeData.filter(task => !task.assigned_by || task.assigned_by === "self"));
  //     } else if (selectedValue === "manager") {
  //      setFilteredData(employeeData.filter(task => task.assigned_by && task.assigned_by !== "self"));
  //     }
  //     setCurrentPage(1);
  //   }
  // }, [selectedValue, employeeData, isManager]);

  // 🔹 Apply filters (assigned by + priority)
// useEffect(() => {
//   let data = employeeData;

//   // Assigned By filter (only for employees)
//   if (!isManager) {
//     if (selectedValue === "self") {
//       data = data.filter(task => !task.assigned_by || task.assigned_by === "self");
//     } else if (selectedValue === "manager") {
//       data = data.filter(task => task.assigned_by && task.assigned_by !== "self");
//     }
//   }

//   // Priority filter
//   if (priorityFilter !== "all") {
//     data = data.filter(task => task.priority === priorityFilter);
//   }

//   setFilteredData(data);
//   setCurrentPage(1);
// }, [selectedValue, employeeData, priorityFilter, isManager]);
useEffect(() => {
  let data = employeeData;

  // For managers in personal view
  if (isManager && viewMode === 'personal') {
    if (selectedValue === "self") {
      data = data.filter(task => !task.assigned_by || task.assigned_by === "self");
    } else if (selectedValue === "hr") {
      data = data.filter(task => task.assigned_by && task.assigned_by !== "self" && task.assigned_by !== LS.get('name'));
    }
  }
  // For HR in personal view
  else if (isHR && viewMode === 'personal') {
    if (selectedValue === "self") {
      data = data.filter(task => !task.assigned_by || task.assigned_by === "self");
    }
    // HR doesn't have tasks assigned by others in personal view, so no additional filtering needed
  }
  // For employees (existing logic)
  else if (!isManager && !isHR) {
    if (selectedValue === "self") {
      data = data.filter(task => !task.assigned_by || task.assigned_by === "self");
    } else if (selectedValue === "manager") {
      data = data.filter(task => task.assigned_by && task.assigned_by !== "self");
    }
  }

  // Priority filter (applies to all user types)
  if (priorityFilter !== "all") {
    data = data.filter(task => task.priority === priorityFilter);
  }

  setFilteredData(data);
  setCurrentPage(1);
}, [selectedValue, assignedByFilter, employeeData, priorityFilter, isManager, isHR, viewMode]);

const handleReset = () => {
  setDateRange([{
    startDate: null,
    endDate: null,
    key: "selection"
  }]);
  
  if (isManager) {
    if (viewMode === 'personal') {
      setFilteredData(personalTasks);
    } else {
      setFilteredData(assignedTasks);
    }
  } else if (isHR) {
    if (viewMode === 'personal') {
      setFilteredData(hrPersonalTasks);
    } else {
      setFilteredData(hrAssignedTasks);
    }
  } else {
    setFilteredData(employeeData);
  }
  
  setCurrentPage(1);
  setSortConfig({ column: null, direction: 'asc' });
  setShowDatePicker(false);
  SetValueSelected('');
  setPriorityFilter("all");
  setAssignedByFilter("all");
  if (!isManager && !isHR) {
    setSelectedValue("all");
  }
};

      const handleChange = (e) => {
        const {name , checked} = e.target ;
        console.log(name);

        if(name == "allSelect") {
            let tempEmp = employeeData.map(item => {
                return {...item,isChecked: checked,category:name}
            }) ;
            console.log(tempEmp);
            SetAllSelect(tempEmp);
            setEmployeeData(tempEmp) ;
        }
        else { 
            console.log("SelectOne")
            let tempUser = employeeData.map(item => item.name === name ? {...item, isChecked: checked,category: "SelectOne"} : item);
            console.log(tempUser);
            let user= Object.assign(tempUser.filter(item=>item.category==="SelectOne"));
            console.log(user)
            SetSelectone(user);
            setEmployeeData(tempUser) ;
        }
    }

    const handletaskeditChange=(e)=>{
      const { name, value } = e.target;
      console.log("name:",name,"- value:",value );

      SetEditmodel((prevData) => ({
          ...prevData,
          Task_details: prevData.Task_details.map((item, index) =>
              index === 0 ? { ...item, [name]: value } : item
          )
      }));
    }

    const handleduedateeditChange=(e)=>{
      const{value}=e.target;
      console.log(value);
      SetEditmodel({ ...editModel,due_date:value})
    }

    const handleEditmodel = (index, e) => {
      const { name, value } = e.target;
      const updatedEditModel = [...editModel];
      updatedEditModel[index] = { ...updatedEditModel[index], [name]: value };
      SetEditmodel(updatedEditModel);
    };
    
    const handleAllChange=(e,index,type)=>{
       const {name,value}=e.target;
       console.log(name +"-"+ value);
       setModelData({ ...modeldata, [name]: value });
    }

    const handleforAllChange = (e) => {
      const { name, value } = e.target;
      console.log("name:",name,"- value:",value );
      setModelData((prevData) => ({
          ...prevData,
          Task_details: prevData.Task_details.map((item, index) =>
              index === 0 ? { ...item, [name]: value } : item
          )
      }));
  };
  
  console.log("duedate:",modeldata.due_date);

    const handleButtonClick = (value) => {
        setModalOpen(false);
        SetOpenmodel(false);
    };

      const handleTaskChange = (index, event) => {
        const newTasks = [...modeldata.task];
        newTasks[index] = event.target.value; 
        setModelData({ ...modeldata, task: newTasks, });
      };

      const today = new Date();
      const month = ("0" + (today.getMonth() + 1)).slice(-2);
      const year = today.getFullYear();
      const date = ("0" + today.getDate()).slice(-2);
      const currentDate = `${year}-${month}-${date}`;
      
      console.log("Current date:",currentDate);
      

     // Helper: format subtasks for backend
// const formatSubtasksForBackend = (subtasks) => {
//   return (subtasks || []).map((s) => ({
//     title: s.title || s.text || "",
//     done: s.done ?? s.completed ?? false,
//   }));
// };
// Normalize subtasks into a consistent format
const normalizeSubtasks = (subtasks) => {
  return (subtasks || []).map((s) => ({
    id: s.id || Date.now() + Math.random(),   // fallback id
    title: s.title || s.text || "",           // prefer title, else text
    completed: s.completed ?? s.done ?? false // prefer completed, else done
  }));
};
      const handleonSubmit = async () => {
  let taskArr = [];

  try {
    if (isManager || isHR) {
      if (selectedUsers.length === 0) {
        // ✅ No user selected → assign to self
        const selfTask = {
          Tasks: modeldata.task,
          userid: LS.get("id"),        
          assigned_by: "self", // ✅ Always "self" when assigning to yourself
          date: currentDate,
          due_date: modeldata.due_date,
          priority: modeldata.priority || "Medium",
          subtasks: normalizeSubtasks(modeldata.subtasks || []),
        };
        taskArr.push(selfTask);

        const selfMessage = isHR ? "Task Assigned to HR" : "Task Assigned to Manager";
        toast.success(selfMessage);
      } else {
        // ✅ User selected → assign to others
        for (let i = 0; i < selectedUsers.length; i++) {
          const taskdetails = {
            Tasks: modeldata.task,
            userid: selectedUsers?.[i]?.userid,
            assigned_by: LS.get("name"), // ✅ Use actual name when assigning to others
            date: currentDate,
            due_date: modeldata.due_date,
            priority: modeldata.priority || "Medium",
            subtasks: normalizeSubtasks(modeldata.subtasks || []),
          };
          taskArr.push(taskdetails);
        }

        const assignMessage = isHR ? "Task Assigned to Manager" : "Task Assigned to Employee(s)";
        toast.success(assignMessage);
      }

      console.log("taskArr:", taskArr);

      const response = await axios({
        method: "post",
        url: `${ipadr}/task_assign_to_multiple_members`,
        data: { Task_details: taskArr },
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.status === 200) {
        setModelData({
          task: [""],
          userid: "",
          date: "",
          due_date: "",
          TL: "",
          priority: modeldata.priority || "Medium",
          subtasks: [],
        });
      } else {
        toast.error("Error while adding the task");
      }
      setModalOpen(false);
    } else {
      // ✅ Employee/HR self-assignment flow
      const singletask = {
        task: modeldata.task,
        userid: userid,
        date: currentDate,
        due_date: modeldata.due_date,
        priority: modeldata.priority || "Medium",
        assigned_by: "self", // ✅ Always "self" for individual task creation
        subtasks: normalizeSubtasks(modeldata.subtasks || []),
      };
      
      console.log("singletask:", singletask);

      const response = await fetch(`${ipadr}/add_task`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(singletask),
      });

      if (response.status === 200) {
        toast.success("Task Added successfully");
        setModelData({
          task: [""],
          userid: "",
          date: "",
          due_date: "",
          priority: "Medium",
          subtasks: [],
        });
      } else {
        toast.error("Error while adding the task");
      }
      setModalOpen(false);
    }

    fetchEmpdata();
  } catch (error) {
    console.error("Error submitting task:", error);
    toast.error("Error submitting task");
  }
};

       const deleteTask = async (taskId) => {
          if (!taskId) {
              toast.error("Invalid task ID");
              return;
          }
          
          console.log("Deleting task with ID:", taskId);
          
          try {
            const response = await fetch(`${ipadr}/task_delete/${taskId}`, {
              method: "DELETE",
              headers: {
                "Content-Type": "application/json",
              },
            });

            const data = await response.json();
            if (!response.ok) {
              throw new Error(data.detail || "Failed to delete task");
            }

            toast.success("Task deleted successfully!");
            fetchEmpdata();
          } catch (error) {
            console.error("Error deleting task:", error);
            toast.error(error.message);
          }
        };

        const fetchTasks = async (userId, selectedDate) => {
            setLoading(true);
            console.log(selectedDate);
            try {
              const response = await fetch(
                `${ipadr}/get_tasks/${userId}/${selectedDate}`
              );
        
              if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || "Failed to fetch tasks");
              }
        
              const data = await response.json();
              if (data.message) {
                setEmployeeData([]);
                setFilteredData([]);
              } else {
                setEmployeeData(data);
                setFilteredData(data);
              }
            } catch (error) {
              setError(error.message);
            } finally {
              setLoading(false);
            }
          };

      const handleoneditSubmit=async()=>{
        try {
            console.log("editmodel:",editModel);
            console.log("editmodel task:",editModel?.[0]?.task);
            
            if (!editModel || editModel.length === 0) {
                toast.error("No task data to update");
                return;
            }

    //           const formattedSubtasks = (editModel?.[0]?.subtasks || []).map(s => ({
    //   title: s.title || s.text || "",
    //   done: s.done ?? s.completed ?? false
    // }));
            
            const updatedetails={
                updated_task:editModel?.[0]?.task,
                userid:editModel?.[0]?.userid,
                status:editModel?.[0]?.status,
                due_date:editModel?.[0]?.due_date,
                priority: editModel?.[0]?.priority || "Medium", 
                taskid:editModel?.[0]?._id,
                subtasks: normalizeSubtasks(editModel?.[0]?.subtasks || [])
            }
            console.log("updatedetails:",updatedetails);

            const response=await  axios({
                method: 'put',
                url: `${ipadr}/edit_task`,
                data: updatedetails, 
                headers: {
                    'Content-Type': 'application/json'
                },    
            });

            if(response.status===200) {
                toast.success("Task edited successfully");
            } else {
                toast.error("Error while editing the task");
            }
            SetOpenmodel(false);
            fetchEmpdata();
        } catch(error) {
            console.error("Error editing task:", error);
            toast.error("Error editing task");
        }
      }

      const confirm=async (id)=>{
        if (!id) {
            console.error("No ID provided for confirm function");
            toast.error("Invalid task ID");
            return;
        }
        
        try {
            const response= await axios.get(`${ipadr}/get_single_task/${id}`);
            const taskdetails= response.data;
            console.log("taskdetails:",taskdetails);
            
            // Handle the response properly
            let safedetails;
            if (Array.isArray(taskdetails)) {
                safedetails = taskdetails;
            } else {
                // If it's a single object, wrap it in an array
                safedetails = [{
                    userid: taskdetails.userid || '',
                    task: taskdetails.task || '',
                    status: taskdetails.status || '',
                    due_date: taskdetails.due_date || '',
                    priority: taskdetails.priority || 'Medium', 
                    _id: taskdetails._id || taskdetails.id || '',
                }];
            }

            SetEditmodel(safedetails);
            SetOpenmodel(true);
        } catch (error) {
            console.error("Error in confirm function:", error);
            toast.error("Error fetching task details");
        }
      }

      let url1='';
      let url2='';
      
      if(isManager) {
        url1=`${ipadr}/get_team_members?TL=${LS.get('name')}`;
        // url2=`${ipadr}/get_assigned_task?TL=${LS.get('name')}&userid=${ValueSelected}`
        url2=`${ipadr}/get_assigned_task?manager_name=${LS.get('name')}&userid=${ValueSelected}`

      }else if(isHR) {
    url1=`${ipadr}/get_manager`;
    url2=`${ipadr}/get_assigned_task?TL=${LS.get('name')}&userid=${ValueSelected}`;
}

      const users=async()=>{
        if (!isManager) return;
        
        try {
            const response =await axios.get(`${url1}`)
            const userdetails=response.data && Array.isArray(response.data) ? response.data:[];
            console.log("userdetails",userdetails)
            
            SetOptions(userdetails);
        } catch (error) {
            console.error("Error fetching users:", error);
            SetOptions([]);
        }
      }

      console.log("options:",options);
      
   const dropdown = async () => {
  if (isManager && viewMode === 'assigned' && ValueSelected) {
    try {
      const url = `${ipadr}/get_assigned_task?TL=${LS.get('name')}&userid=${ValueSelected}`;
      const response = await axios.get(url);
      const Empdata = Array.isArray(response.data) ? response.data : [];
      const employeeFilteredTasks = Empdata.filter(task => task.userid !== LS.get('id'));
      setFilteredData(employeeFilteredTasks);
    } catch (error) {
      console.error("Error in manager dropdown:", error);
      setFilteredData([]);
    }
  } else if (isHR && viewMode === 'assigned' && ValueSelected) {
    try {
      const url = `${ipadr}/get_assigned_task?TL=${LS.get('name')}&userid=${ValueSelected}`;
      const response = await axios.get(url);
      const Empdata = Array.isArray(response.data) ? response.data : [];
      const managerFilteredTasks = Empdata.filter(task => task.userid !== LS.get('id'));
      setFilteredData(managerFilteredTasks);
    } catch (error) {
      console.error("Error in HR dropdown:", error);
      setFilteredData([]);
    }
  }
};



      const [note, setNote] = useState({
        body: '',
        bg: ''
      });
      const [editNote, setEditNote] = useState();
      const [toggleForm, setToggleForm] = useState(false);
      const [toggleEditForm, setToggleEditForm] = useState(false);
    
      const handlesChange = (e) => {
        if (toggleEditForm) {
          setEditNote({ ...editNote, [e.target.name]: e.target.value });
        }
    
        if (toggleForm) {
          setNote({ ...note, [e.target.name]: e.target.value });
        }
      };

      const handleDelete = (id) => {
        const leftNotes = employeeData.filter((note) => note.id !== id);
        setEmployeeData(leftNotes);
        setFilteredData(leftNotes);
      };
      
      const handleEditSubmit = (e) => {
        e.preventDefault();
        const updatedNotes = employeeData.map((note) => (note.id === editNote.id ? editNote : note));
        setEmployeeData(updatedNotes);
        setFilteredData(updatedNotes);
        setEditNote({});
        setToggleEditForm(!toggleEditForm);
      };
 
      const handleSelectChange =(event)=>{
        setSelectedValue(event.target.value);
      };
      
      const handleSelectvalueChange = (event) => {
    SetValueSelected(event.target.value);
};
useEffect(() => {
  if ((isManager || isHR) && ValueSelected && viewMode === 'assigned') {
    dropdown();
  }
}, [ValueSelected, viewMode]);


      const addTask = () => {
        setModelData({ ...modeldata, task: [...modeldata.task, ""] });
      };
    
      const onSelect=(selectedList)=>{
        setSelectedUsers(selectedList);
        console.log("selected",selectedList);
      }
      
     const onRemove=(selectedList)=>{
      setSelectedUsers(selectedList);
      console.log("unselected:",selectedList);
     }

     const handleDateRangeChange = (ranges) => {
      const { startDate, endDate } = ranges.selection;
      setDateRange([ranges.selection]);
      filterDataByDateRange(startDate, endDate);
    };

    const filterDataByDateRange = (startDate, endDate) => {
        if (!startDate || !endDate) {
          setFilteredData(employeeData);
          return;
        }

        const filtered = employeeData.filter(item => {
          const itemDate = parseISO(convertDateFormat(item.date || item.due_date));
          return isWithinInterval(itemDate, {
            start: startDate,
            end: endDate
          });
        });

        setFilteredData(filtered);
        setCurrentPage(1);
    };

    const convertDateFormat = (dateString) => {
        if (!dateString) return '';
        const [day, month, year] = dateString.split('-');
        return `${year}-${month}-${day}`;
    };
          
    console.log("filter data:",filteredData);
    
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

    console.log("currentItems:",currentItems)

    // Show loading state
    if (loading) {
        return (
            <div className="mr-8 p-10 bg-white min-h-96 lg:min-h-[90vh] w-full shadow-black rounded-xl justify-center items-center relative jsonback ml-10 rounded-md h-screen overflow-y-scroll scrollbar-hide">
                <div className="flex justify-center items-center h-64">
                    <div className="text-xl">Loading tasks...</div>
                </div>
            </div>
        );
    }

    // Show error state
    if (error) {
        return (
            <div className="mr-8 p-10 bg-white min-h-96 lg:min-h-[90vh] w-full shadow-black rounded-xl justify-center items-center relative jsonback ml-10 rounded-md h-screen overflow-y-scroll scrollbar-hide">
                <div className="flex justify-center items-center h-64">
                    <div className="text-xl text-red-500">Error: {error}</div>
                    <button 
                        onClick={fetchEmpdata}
                        className="ml-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

     return(
      <div className="mr-8 p-10 bg-white min-h-96 lg:min-h-[90vh] w-full shadow-black rounded-xl justify-center items-center relative jsonback ml-10 rounded-md h-screen overflow-y-scroll scrollbar-hide">
  <div className="">
    {/* Title and Toggle Section */}
    <div className="flex justify-between items-center mb-6">
    
        <h1 className="text-5xl font-semibold font-inter pb-2 text-transparent bg-gradient-to-r from-zinc-600 to-zinc-950 bg-clip-text border-b-2">
          Task Assign
        </h1>
        
        {/* Toggle Button for Manager - positioned right of title */}
        {isManager && (
          <div className="flex bg-gray-200 rounded-lg p-1 ml-auto">
            <button
              onClick={() => setViewMode('personal')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                viewMode === 'personal' 
                  ? 'bg-blue-500 text-white shadow-md' 
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              My Tasks ({personalTasks.length})
            </button>
            <button
              onClick={() => setViewMode('assigned')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                viewMode === 'assigned' 
                  ? 'bg-blue-500 text-white shadow-md' 
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Assigned to Team ({assignedTasks.length})
            </button>
          </div>
        )}

        {isHR && (
  <div className="flex bg-gray-200 rounded-lg p-1 ml-auto">
    <button
      onClick={() => setViewMode('personal')}
      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
        viewMode === 'personal' 
          ? 'bg-blue-500 text-white shadow-md' 
          : 'text-gray-600 hover:text-gray-800'
      }`}
    >
      My Tasks ({hrPersonalTasks.length})
    </button>
    <button
      onClick={() => setViewMode('assigned')}
      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
        viewMode === 'assigned' 
          ? 'bg-blue-500 text-white shadow-md' 
          : 'text-gray-600 hover:text-gray-800'
      }`}
    >
      Assigned to Managers
    </button>
  </div>
)}
      
    </div>

    <div>
  
      <header className="px-5 py-4 border-b border-gray-200 flex justify-between items-center">

        <button className="bg-blue-500 hover:bg-blue-400 hover:text-slate-900 text-white text-sm font-inter px-4 py-2 rounded-full shadow-lg" onClick={() => setModalOpen(true)}>
          Add Task
        </button>

        {/* Center: Filters */}
        <div className="flex items-center space-x-3">
          {/* Employee Dropdown - Only show when manager is in "assigned to team" mode */}
          {isManager && viewMode === 'assigned' && (
            <select 
              className="w-48 border border-gray-400 rounded-lg px-4 py-2 text-gray-700 bg-white shadow-md outline-none focus:ring-2 focus:ring-blue-500 transition" 
              value={ValueSelected} 
              onChange={handleSelectvalueChange}
            >
              <option value="">--select Employee--</option>
>>>>>>> 3650a4d1c71190f0215d3fef0e081c80a4dfc274
              {options.map(item => (
                <option key={item.id || item.userid} value={item.userid}>{item.name}</option>
              ))}
            </select>
<<<<<<< HEAD
            <input type="text" placeholder="Search task by title..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="px-3 py-1 text-sm border border-gray-300 rounded-md" />
          </div>
          <div className="flex items-center">
            <button onClick={() => { setFilteredData(employeeData); SetValueSelected(''); setSearchTerm(''); }} className="px-3 py-1 bg-gray-500 text-white rounded-md text-sm"><RotateCw className="w-4 h-4 inline-block" /> Reset</button>
=======
          )}

          {/* Manager Dropdown - Only show when HR is in "assigned to managers" mode */}
          {isHR && viewMode === 'assigned' && (
            <select 
              className="w-48 border border-gray-400 rounded-lg px-4 py-2 text-gray-700 bg-white shadow-md outline-none focus:ring-2 focus:ring-blue-500 transition" 
              value={ValueSelected} 
              onChange={handleSelectvalueChange}
            >
              <option value="">--select Manager--</option>
              {options.map(item => (
                <option key={item.id || item.userid} value={item.userid}>{item.name}</option>
              ))}
            </select>
          )}

          {/* Personal Tasks Filter for HR - Only show when HR is in "personal" mode */}
          {isHR && viewMode === 'personal' && (
            <select
              className="w-48 border border-gray-400 rounded-lg px-4 py-2 text-gray-700 bg-white shadow-md outline-none focus:ring-2 focus:ring-blue-500 transition"
              value={selectedValue}
              onChange={(e) => setSelectedValue(e.target.value)}
            >
              <option value="all">All Personal Tasks</option>
              <option value="self">Assigned by Me</option>
            </select>
          )}

          {/* Personal Tasks Filter - Only show when manager is in "personal" mode */}
          {isManager && viewMode === 'personal' && (
            <div>
            <select
              className="w-48 border border-gray-400 rounded-lg px-4 py-2 text-gray-700 bg-white shadow-md outline-none focus:ring-2 focus:ring-blue-500 transition"
              value={selectedValue}
              onChange={(e) => setSelectedValue(e.target.value)}
            >
              <option value="all">All Personal Tasks</option>
              <option value="self">Assigned by Me</option>
              <option value="hr">Assigned by HR</option>
            </select>

             <select
            className="w-48 border border-gray-400 rounded-lg px-4 py-2 text-gray-700 bg-white shadow-md outline-none focus:ring-2 focus:ring-blue-500 transition"
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
          >
            <option value="all">All Priorities</option>
            <option value="High">High Priority</option>
            <option value="Medium">Medium Priority</option>
            <option value="Low">Low Priority</option>
          </select>
          </div>
          )}

          {/* Employee Filter - unchanged for non-managers */}
          {!isManager && !isHR && (
            <div>
            <select
              className="w-48 border border-gray-400 rounded-lg px-4 py-2 text-gray-700 bg-white shadow-md outline-none focus:ring-2 focus:ring-blue-500 transition"
              value={selectedValue}
              onChange={(e) => setSelectedValue(e.target.value)}
            >
              <option value="all">All Tasks</option>
              <option value="self">Assigned by Me</option>
              <option value="manager">Assigned by Manager</option>
            </select>

             <select
            className="w-48 border border-gray-400 rounded-lg px-4 py-2 text-gray-700 bg-white shadow-md outline-none focus:ring-2 focus:ring-blue-500 transition"
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
          >
            <option value="all">All Priorities</option>
            <option value="High">High Priority</option>
            <option value="Medium">Medium Priority</option>
            <option value="Low">Low Priority</option>
          </select>
          </div>
          )}

          
        </div>

        {/* Right: Reset and Date Range */}
        <div className="flex items-center gap-4">
          <button
            onClick={handleReset}
            className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 flex items-center gap-2"
          >
            <RotateCw className="w-4 h-4" />
            Reset
          </button>
          
          <div className="relative">
            <button
              onClick={() => setShowDatePicker(!showDatePicker)}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              {showDatePicker ? 'Hide Date Range' : 'Show Date Range'}
            </button>
            {showDatePicker && (
              <div className="absolute right-0 top-12 z-50 bg-white shadow-lg rounded-md border">
                <DateRangePicker
                  ranges={dateRange}
                  onChange={handleDateRangeChange}
                  moveRangeOnFirstSelection={false}
                />
              </div>
            )}
>>>>>>> 3650a4d1c71190f0215d3fef0e081c80a4dfc274
          </div>
        </div>
      </header>

<<<<<<< HEAD
      <div className="notes flex-1 overflow-auto overflow-x-hidden p-4 border-t border-gray-100 assigntask-thin-scrollbar">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 auto-rows-fr">
          {currentItems && currentItems.length > 0 ? (
            currentItems.map((item, i) => (
              <Note handleDelete={() => setDeleteTarget({ id: item._id || item.id || item.taskid, title: Array.isArray(item.task) ? item.task[0] : item.task })} handleEdit={() => handleEdit(item._id || item.id || item.taskid)} key={item._id || item.id || item.taskid || i} empdata={item} />
            ))
          ) : (
            <div className="col-span-4 text-center py-8">
              <p className="text-gray-500 text-lg">No tasks found. Please add a new task.</p>
            </div>
          )}
        </div>
      </div>
    {(itemsToShow < sortedData.length || itemsToShow > 8) && (
  <div className="flex justify-center gap-4 mt-8">
    {itemsToShow < sortedData.length && (
      <button
        onClick={() => setItemsToShow(prev => prev + 8)} // load 8 more tasks
        className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
      >
        Load More
      </button>
    )}
    {itemsToShow > 8 && (
      <button
        onClick={() => setItemsToShow(8)} // reset to initial view
        className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition"
      >
        Show Less
      </button>
    )}
  </div>
)}

      {modalOpen && createPortal(
        <Modal closeModal={() => { setModalOpen(false); setModelData({ task: [""], userid: "", date: "", due_date: "", priority: "Medium", subtasks: [] }); setSelectedUsers([]); }} onSubmit={handleonSubmit} onCancel={() => { setModalOpen(false); setModelData({ task: [""], userid: "", date: "", due_date: "", priority: "Medium", subtasks: [] }); setSelectedUsers([]); }}>
          <div className="max-h-[50vh] overflow-y-auto">
            {modeldata.task.map((task, index) => (
              <div key={index} className="mb-4">
                <label className="block text-lg font-semibold text-gray-700 mb-2">Task {index + 1}</label>
                <textarea name={`task-${index}`} value={task} onChange={e => { const newTasks = [...modeldata.task]; newTasks[index] = e.target.value; setModelData({ ...modeldata, task: newTasks }); }} className="w-full border border-gray-300 rounded-lg px-4 py-3 shadow-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition placeholder-gray-500" placeholder="Enter task description..." />
              </div>
            ))}
            <button type="button" onClick={() => setModelData({ ...modeldata, task: [...modeldata.task, ""] })} className="bg-gradient-to-r from-blue-500 to-purple-500 text-white font-medium px-4 py-2 rounded-lg shadow-md hover:scale-105 transition transform mb-4">➕ Add Another Task</button>
            <div className="mt-4">
              <label className="block text-lg font-semibold text-gray-700 mb-2">Due date</label>
              <input type="date" name="due_date" value={modeldata.due_date ? String(modeldata.due_date).slice(0, 10) : ''} onChange={e => setModelData({ ...modeldata, due_date: e.target.value })} min={new Date().toISOString().split("T")[0]} className="w-full border border-gray-300 rounded-lg px-4 py-3 shadow-sm focus:ring-2 focus:ring-pink-400 focus:border-pink-400 transition cursor-pointer" />
            </div>
            <div className="mt-4">
              <label className="block text-lg font-semibold text-gray-700 mb-2">Priority</label>
              <select name="priority" value={modeldata.priority || ""} onChange={e => setModelData({ ...modeldata, priority: e.target.value })} className="w-full border border-gray-300 rounded-lg px-4 py-3 shadow-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-400">
                <option value="" disabled hidden>Select Priority</option>
                 <option value="High">High</option>
                 <option value="Medium">Medium</option>
                 <option value="Low">Low</option>
               </select>
             </div>
            <div className="mt-4">
              <label className="block text-lg font-semibold text-gray-700 mb-2">Subtasks</label>
              {modeldata.subtasks?.map((subtask, idx) => (
                <div key={idx} className="flex items-center mb-2">
                  <input type="checkbox" checked={subtask.done} onChange={() => { const updated = [...modeldata.subtasks]; updated[idx].done = !updated[idx].done; setModelData({ ...modeldata, subtasks: updated }); }} className="mr-2" />
                  <input type="text" value={subtask.title} onChange={e => { const updated = [...modeldata.subtasks]; updated[idx].title = e.target.value; setModelData({ ...modeldata, subtasks: updated }); }} className="w-full border border-gray-300 rounded px-2 py-1" />
                </div>
              ))}
              <button onClick={() => setModelData({ ...modeldata, subtasks: [...(modeldata.subtasks || []), { title: "", done: false }] })} className="text-blue-500 mt-2">➕ Add Subtask</button>
            </div>
            <div className="mt-4">
              <label className="block text-lg font-semibold text-gray-700 mb-2">Select {isManager ? 'Employee(s)' : 'Manager(s)'}</label>
              <div className="w-full max-w-sm bg-white border border-gray-300 rounded-lg px-4 py-2 shadow-sm">
                <Multiselect options={options} selectedValues={selectedUsers} onSelect={setSelectedUsers} onRemove={setSelectedUsers} displayValue="name" className="text-gray-700" avoidHighlightFirstOption={true} />
              </div>
            </div>
          </div>
        </Modal>, document.body)}
      {modalOpen && editModel.length > 0 && createPortal(
        <Modal closeModal={() => { setModalOpen(false); SetEditmodel([]); }} onSubmit={handleoneditSubmit} onCancel={() => { setModalOpen(false); SetEditmodel([]); }}>
          {editModel.map((item, index) => {
            const isVerifiedEdit = item?.verified === true;
            // Always format due_date as yyyy-mm-dd for the input
            const formatDate = (dateStr) => {
              if (!dateStr) return "";
              if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return dateStr;
              const parts = dateStr.split(/[-\/]/);
              if (parts.length === 3 && parts[2].length === 4) {
                return `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
              }
              return dateStr;
            };
            return (
              <div key={index} className="space-y-4 max-h-[60vh] overflow-y-auto">
                <div>
                  <label className="block mb-1 font-semibold">Task</label>
                  <textarea name="task" value={Array.isArray(item.task) ? item.task[0] : item.task || ""} onChange={e => { const updated = [...editModel]; updated[index].task = e.target.value; SetEditmodel(updated); }} className="w-full border border-gray-300 rounded px-3 py-2" rows="3" required placeholder="Enter task description..." disabled={isVerifiedEdit} />
                </div>
                <div>
                  <label className="block mb-1 font-semibold">Due Date</label>
                  <input type="date" name="due_date" value={formatDate(item.due_date)} onChange={e => { const updated = [...editModel]; updated[index].due_date = e.target.value; SetEditmodel(updated); }} required className="w-full border border-gray-300 rounded px-3 py-2" disabled={isVerifiedEdit} />
                </div>
              <div>
                <label className="block mb-1 font-semibold">Status</label>
                <select name="status" value={item.status || "To Do"} onChange={e => { const updated = [...editModel]; updated[index].status = e.target.value; SetEditmodel(updated); }} className="w-full border border-gray-300 rounded px-3 py-2" disabled={isVerifiedEdit}>
                  <option value="">To Do</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>
              <div>
                <label className="block mb-1 font-semibold">Priority</label>
                <select name="priority" value={item.priority || "Medium"} onChange={e => { const updated = [...editModel]; updated[index].priority = e.target.value; SetEditmodel(updated); }} className="w-full border border-gray-300 rounded px-3 py-2" disabled={isVerifiedEdit}>
                  <option value="" disabled hidden>Select Priority</option>
                   <option value="Low">Low</option>
                   <option value="Medium">Medium</option>
                   <option value="High">High</option>
                 </select>
               </div>
              <div>
                <label className="block mb-1 font-semibold">Subtasks</label>
                {(item.subtasks && Array.isArray(item.subtasks) && item.subtasks.length > 0) ? item.subtasks.map((subtask, sidx) => {
                  const text = subtask.text ?? subtask.title ?? "";
                  const completed = subtask.completed ?? subtask.done ?? false;
                  return (
                    <div key={subtask.id || `subtask-${sidx}`} className="flex items-center mb-2 bg-gray-50 p-2 rounded">
                      <input type="checkbox" checked={completed} onChange={e => { const updated = [...editModel]; updated[index].subtasks[sidx].completed = e.target.checked; SetEditmodel(updated); }} className="mr-2" disabled={isVerifiedEdit} />
                      <input type="text" value={text} onChange={e => { const updated = [...editModel]; updated[index].subtasks[sidx].text = e.target.value; SetEditmodel(updated); }} className="flex-1 border border-gray-300 rounded px-2 py-1" placeholder="Enter subtask description..." disabled={isVerifiedEdit} />
                      <button type="button" onClick={() => { const updated = [...editModel]; updated[index].subtasks = updated[index].subtasks.filter((_, i) => i !== sidx); SetEditmodel(updated); }} className={`ml-2 px-2 py-1 rounded ${isVerifiedEdit ? 'text-gray-400 cursor-not-allowed' : 'text-red-500 hover:text-red-700 hover:bg-red-100'}`} disabled={isVerifiedEdit}>✕</button>
                    </div>
                  );
                }) : <div className="text-gray-500 italic mb-2">No subtasks found</div>}
                <button type="button" onClick={() => { const updated = [...editModel]; if (!updated[index].subtasks) updated[index].subtasks = []; updated[index].subtasks.push({ id: `subtask_${Date.now()}_${Math.random()}`, text: "", title: "", completed: false, done: false }); SetEditmodel(updated); }} className={`w-full mt-2 py-2 px-4 rounded transition-colors ${isVerifiedEdit ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-blue-100 text-blue-700 hover:bg-blue-200'}`} disabled={isVerifiedEdit}>+ Add Subtask</button>
              </div>
            </div>
            );
          })}
        </Modal>, document.body)}
      {/* Use new ConfirmModal (independent from existing Modal) */}
      <ConfirmModal
        open={!!deleteTarget}
        title="Delete task"
        message={deleteTarget?.title}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => { handleDelete(deleteTarget?.id); setDeleteTarget(null); }}
        confirmLabel="Delete"
        cancelLabel="Cancel"
      />
    </div>
  );
};

export default TaskAssign;
=======
{isManager && (
  <div className="mt-4 mb-4 p-4 bg-gray-50 rounded-lg">
    <h2 className="text-xl font-semibold text-gray-800">
      {viewMode === 'personal' 
        ? 'My Personal Tasks (Assigned by Me + HR Assigned)' 
        : 'Tasks Assigned to Team Members'
      }
    </h2>
    {/* <p className="text-gray-600 text-sm mt-1">
      {viewMode === 'personal' 
        ? 'Tasks created by you or assigned to you by HR' 
        : 'Tasks you have assigned to your team members'
      }
    </p> */}
  </div>
)}

{isHR && (
  <div className="mt-4 mb-4 p-4 bg-gray-50 rounded-lg">
    <h2 className="text-xl font-semibold text-gray-800">
      {viewMode === 'personal' 
        ? 'My Personal Tasks' 
        : 'Tasks Assigned to Manager'
      }
    </h2>
    {/* <p className="text-gray-600 text-sm mt-1">
      {viewMode === 'personal' 
        ? 'Tasks created by you or assigned to you by HR' 
        : 'Tasks you have assigned to your team members'
      }
    </p> */}
  </div>
)}

      <div className="notes border-t-2 border-gray-200 mt-5 pt-5 container mx-auto grid md:grid-cols-4 gap-10 ">
        {filteredData && filteredData.length > 0 ? (
          filteredData.map((item, i) => {
            return (
              <Note handleDelete={() => deleteTask(item._id || item.id || item.taskid)} handleEdit={() => confirm(item._id || item.id || item.taskid)} key={item._id || item.id || item.taskid || i} empdata={item} />
            );
          })
        ) : (
            <div className="col-span-4 text-center py-8">
                <p className="text-gray-500 text-lg">
                    {loading ? "Loading tasks..." : "No tasks found. Please add a new task."}
                </p>
            </div>
        )}
      </div>

             {modalOpen &&
        createPortal(
          <Modal
            closeModal={handleButtonClick}
            onSubmit={handleonSubmit}
            onCancel={handleButtonClick}
          >
           
           <>
           <div className="max-h-[50vh] overflow-y-auto">
           {modeldata.task.map((task, index) => (
        <div key={index} className="mb-4">
          <label className="block text-lg font-semibold text-gray-700 mb-2">Task {index + 1}</label>
          <textarea
            name={`task-${index}`}
            value={task}
            onChange={(e) => handleTaskChange(index, e)}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 shadow-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition placeholder-gray-500"
            placeholder="Enter task description..."
          ></textarea>
        </div>
          ))}
           <button
              type="button"
              onClick={addTask}
              className="bg-gradient-to-r from-blue-500 to-purple-500 text-white font-medium px-4 py-2 rounded-lg shadow-md hover:scale-105 transition transform mb-4"
            >
             ➕ Add Another Task
            </button>
             
            <div className="mt-4">
            <label className="block text-lg font-semibold text-gray-700 mb-2">Due date</label>
            <input
               type="date"
                name="due_date"
                value={modeldata.due_date}
                onChange={handleAllChange}
                min={new Date().toISOString().split("T")[0]} 
                className="w-full border border-gray-300 rounded-lg px-4 py-3 shadow-sm focus:ring-2 focus:ring-pink-400 focus:border-pink-400 transition cursor-pointer"
                />
           </div>
           <div className="mt-4">
            <label className="block text-lg font-semibold text-gray-700 mb-2">Priority</label>
            <select
              name="priority"
              value={modeldata.priority || ""}
              onChange={(e) => setModelData({ ...modeldata, priority: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 shadow-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
            >
             <option value="">Select Priority</option>
  <option value="High">High</option>
  <option value="Medium">Medium</option>
  <option value="Low">Low</option>
            </select>
          </div>
          <div className="mt-4">
            <label className="block text-lg font-semibold text-gray-700 mb-2">Subtasks</label>
            {modeldata.subtasks?.map((subtask, idx) => (
              <div key={idx} className="flex items-center mb-2">
                <input
                  type="checkbox"
                  checked={subtask.done}
                  onChange={() => {
                    const updated = [...modeldata.subtasks];
                    updated[idx].done = !updated[idx].done;
                    setModelData({ ...modeldata, subtasks: updated });
                  }}
                  className="mr-2"
                />
                <input
                  type="text"
                  value={subtask.title}
                  onChange={(e) => {
                    const updated = [...modeldata.subtasks];
                    updated[idx].title = e.target.value;
                    setModelData({ ...modeldata, subtasks: updated });
                  }}
                  className="w-full border border-gray-300 rounded px-2 py-1"
                />
              </div>
            ))}
            <button
              onClick={() =>
                setModelData({
                  ...modeldata,
                  subtasks: [...(modeldata.subtasks || []), { title: "", done: false }],
                })
              }
              className="text-blue-500 mt-2"
            >
              ➕ Add Subtask
            </button>
          </div>
   
           {
            (isManager || isHR) && (
      <div className="mt-4">
       <label className="block text-lg font-semibold text-gray-700 mb-2">
      {isManager ? "👤 Select Employee" : "👤 Select Manager"}
       </label>
        <div className="w-full max-w-sm bg-white border border-gray-300 rounded-lg px-4 py-2 shadow-sm">
         <Multiselect
           options={options}
           selectedValues={selectedUsers}
           onSelect={onSelect}
           onRemove={onRemove}
           displayValue="name"
           className="text-gray-700"
           />
           </div>
         </div>
            )

           }
              </div>
            </>
          </Modal>,
          document.body
        )}

  {openmodel &&
  createPortal(
    <Modal
      closeModal={handleButtonClick}
      onSubmit={handleoneditSubmit}
      onCancel={handleButtonClick}
    >
      {editModel &&
        editModel.length > 0 &&
        editModel.map((item, index) => (
          <div key={index} className="space-y-4">
            
            {/* Task */}
            <div>
              <label className="block mb-1 font-semibold">Task</label>
              <textarea
                name="task"
                // value={item.task || ""}
                value={Array.isArray(item.task) ? item.task[0] : item.task || ""}
                onChange={(e) => handleEditmodel(index, e)}
                className="w-full border border-gray-300 rounded px-3 py-2"
                rows="3"
                required
              />
            </div>

            {/* Due Date */}
            <div>
              <label className="block mb-1 font-semibold">Due Date</label>
              {/* <input
                type="date"
                name="due_date"
                value={item.due_date || ""}
                onChange={(e) => handleEditmodel(index, e)}
                className="w-full border border-gray-300 rounded px-3 py-2"
              /> */}
              <input
  type="date"
  name="due_date"
  value={
    item.due_date && item.due_date.includes("-")
      ? (() => {
          const parts = item.due_date.split("-");
          return parts[0].length === 4
            ? item.due_date // already YYYY-MM-DD
            : `${parts[2]}-${parts[1]}-${parts[0]}`; // convert DD-MM-YYYY → YYYY-MM-DD
        })()
      : ""
  }
  onChange={(e) => handleEditmodel(index, e)}
  required
  className="w-full border border-gray-300 rounded px-3 py-2"
/>

            </div>

            {/* Status */}
            <div>
              <label className="block mb-1 font-semibold">Status</label>
              {/* <select
                name="status"
                value={item.status || ""}
                onChange={(e) => handleEditmodel(index, e)}
                className="w-full border border-gray-300 rounded px-3 py-2"
              >
                <option value="">--Select--</option>
                <option value="Not Started">Not Started</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select> */}
              <select
  name="status"
  value={item.status || "Not Started"}
  onChange={(e) => handleEditmodel(index, e)}
  className="w-full border border-gray-300 rounded px-3 py-2"
>
  <option value="Not Started">Not Started</option>
  <option value="In Progress">In Progress</option>
  <option value="Completed">Completed</option>
</select>

            </div>

            {/* Priority */}
            <div>
              <label className="block mb-1 font-semibold">Priority</label>
              <select
                name="priority"
                value={item.priority || "Medium"}
                onChange={(e) => handleEditmodel(index, e)}
                className="w-full border border-gray-300 rounded px-3 py-2"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>

            {/* Subtasks */}
<div>
  <label className="block mb-1 font-semibold">Subtasks</label>
  {(item.subtasks && item.subtasks.length > 0 ? item.subtasks : []).map((subtask, sidx) => {
    const text = subtask.text ?? subtask.title ?? "";
    const completed = subtask.completed ?? subtask.done ?? false;

    return (
      <div key={subtask.id || sidx} className="flex items-center mb-2">
        {/* Checkbox */}
        <input
          type="checkbox"
          checked={completed}
          onChange={(e) => {
            const updatedModel = [...editModel];
            updatedModel[index].subtasks[sidx] = {
              ...updatedModel[index].subtasks[sidx],
              completed: e.target.checked,
            };
            SetEditmodel(updatedModel);
          }}
          className="mr-2"
        />
        {/* Title */}
        <input
          type="text"
          value={text}
          onChange={(e) => {
            const updatedModel = [...editModel];
            updatedModel[index].subtasks[sidx] = {
              ...updatedModel[index].subtasks[sidx],
              text: e.target.value,
            };
            SetEditmodel(updatedModel);
          }}
          className="w-full border border-gray-300 rounded px-2 py-1"
        />
      </div>
    );
  })}

  {/* Add new subtask */}
  <button
    type="button"
    onClick={() => {
      const updatedModel = [...editModel];
      if (!updatedModel[index].subtasks) updatedModel[index].subtasks = [];
      updatedModel[index].subtasks.push({
        id: Date.now(),
        text: "",
        completed: false,
      });
      SetEditmodel(updatedModel);
    }}
    className="text-blue-500 mt-2"
  >
    ➕ Add Subtask
  </button>
</div>


            {/* Assigned To */}
            {/* <div>
              <label className="block mb-1 font-semibold">Assigned To</label>
              <input
                type="text"
                name="assigned_to"
                value={item.assigned_to || ""}
                onChange={(e) => handleEditmodel(index, e)}
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
            </div> */}

          </div>
        ))}
    </Modal>,
    document.body
  )}

                        
</div>
                                
  </div>

    </div>
      )
}

export default TaskAssign;
>>>>>>> 3650a4d1c71190f0215d3fef0e081c80a4dfc274
