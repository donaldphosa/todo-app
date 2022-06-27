import React,{useState, useEffect} from 'react';
import {signOut} from 'firebase/auth'
import {auth, db} from './firebase'
import { useNavigate } from 'react-router-dom';
import {collection, getDocs, addDoc, updateDoc, doc, deleteDoc} from 'firebase/firestore'
import {BsFillTrashFill }from 'react-icons/bs'





function Home() {
  const [tasks, setTasks] = useState([]);
  const [taskName, setTasksName] = useState('');
  const [tasksDesc, setTasksDesc] = useState('');
  const taskref = collection(db,"items");
  const [tab,setTab] = useState("currenTtasks");
  const [proi, setProi] = useState("default");
 
const id = JSON.parse(localStorage.getItem("id"))


//adding a task to our database
  const addtask = async()=>{
   
    await addDoc(taskref, {taskName:taskName, tasksdesc:tasksDesc, userid:id, status:"current", priority:"default"})
    window.location.reload()
    // setTasks((prev)=>{return [...prev,{taskName:taskName, tasksdesc:tasksDesc, userid:id, status:"current", priority:"default"}]})

  }
  //updating the status of a task
  const updateStatus = async (id, status)=>{
    const taskdoc = doc(db,"items", id);
    const newField = {status:"completed"};
    await updateDoc(taskdoc,newField);
  }


  const deleteTask =async(id)=>{
    const taskdoc = doc(db,"items", id);
    setTasks(prevTasks =>{
      return prevTasks.filter((prev)=>{return id !== prev.id})
    })
    await deleteDoc(taskdoc)

  }

  useEffect(()=>{
    //pulling data from firebase
    const getTask = async()=>{
      const data = await getDocs(taskref);
      let dt = []
     data.docs.map((doc)=>{
      
        if(doc.data().userid === id){
         
            dt.push({...doc.data(), id:doc.id} )
           }
        })
      
        setTasks(dt)
      
      //setTasks(data.docs.map((doc)=>({...doc.data(), id:doc.id})))
     
    }
 

    getTask();
  },[])

     const navigate = useNavigate()
    const logout = async() =>{
        await signOut(auth);
        navigate("/")
    }
    
  const  styles = {
    background: 'black',
    color: '#fff'
  }

  

  const  priority = {
    background: proi,
    
  }


  async function changColor(event, id){
    const p =event.target.className
    setTasks((items)=>{
      return items.map((item)=>{
       return id === item.id?{...item, priority: p}:item
      })
     })  

    const taskdoc = doc(db,"items", id);
    const newField = {priority:p};
    await updateDoc(taskdoc,newField);

  
  }

   
  return (
    <div className='login'>
      <div className='tabs-btns'>
      <button style={tab==='currenTtasks'?styles:{}} onClick={()=>setTab("currenTtasks")}>Tasks</button>
      <button style={tab==='addtasks'?styles:{}}  onClick={()=>setTab("addtasks")}>Add tasks</button>
      </div>
    <div className='scroll'>  
   { tab==="currenTtasks" && <CurrentItem task={tasks}
         setTasks={setTasks}
        updateStatus={updateStatus}
        changColor={changColor}
        priority={priority}
        deleteTask={deleteTask}
        
      />}
  { tab==="addtasks"  && <AddTask 
        addtask={addtask} 
        setTasksName={setTasksName}
        setTasksDesc={setTasksDesc}
        setTab={setTab}
      />}</div>
     <button className='button' onClick={logout}>logout</button>
    </div>
  )
}

const CurrentItem = ({task,updateStatus,priority,changColor,setTasks,deleteTask})=>{

    return(<>
        {task.length!==0?task.map((tak,index)=>{return<div key={index} className="tasks">
          <div className='width'><h2>{tak.taskName}</h2>
          <h5>{tak.tasksdesc}</h5>
          <h5>status: {tak.status}</h5></div>
          <div>
            <div style={tak.priority==="red"?{...priority,background:tak.priority}:{}} onClick={(e)=>changColor(e,tak.id,tak.priority)} className='red'></div>
            <div style={tak.priority==="blue"?{...priority,background:tak.priority}:{}}  onClick={(e)=>changColor(e,tak.id,tak.priority)} className='blue'></div>
            <div style={tak.priority==="green"?{...priority,background:tak.priority}:{}}  onClick={(e)=>changColor(e,tak.id,tak.priority)} className='green'></div>
          </div>
          <button onClick={()=>deleteTask(tak.id)} style={{outline:"none",border:"none"}}><BsFillTrashFill /></button>
          <button className='button btn' onClick={()=>{
            updateStatus(tak.id,tak.status);
            setTasks((previous)=>{
              return previous.map((prev)=>{return tak.id===prev.id?{...prev,status:"completed"}:prev})
            })
            
            } }>complete</button>
        </div>}):<h4 className='noTasks'>no tasks</h4>}
        </>
    )
}

const AddTask= ({addtask,setTasksDesc,setTasksName,setTab})=>{
    return(
        <div className='addtask'>
          <input placeholder='item title' onChange={(e)=>{setTasksName(e.target.value)}}/>
          <input placeholder='item desc' onChange={(e)=>{setTasksDesc(e.target.value)}}/>
        
          <button className='button btn' onClick={()=>{
            addtask();
            setTab("currenTtasks")
            }}>Add task</button>
        </div>
    )
}

export default Home