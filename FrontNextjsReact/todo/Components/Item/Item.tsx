import * as React from "react";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import EditIcon from "@mui/icons-material/Edit";
import Checkbox from "@mui/material/Checkbox";
import axios from "axios";
import Swal from "sweetalert2";
import { Item as ItemType } from "../../Types/Types";


const back_url = "https://dockerdemo-production.up.railway.app/tasks"

export default function Item(props) {
  const [data, setData] = React.useState<ItemType>({
    id: props.id,
    title: props.title,
    description: props.description,
    status: props.status,
  });

  // const [description, setDescription] = React.useState(false);
  // const [edit, setEdit] = React.useState(false);



  const toggleComplete = async () => {
    setData({ ...data, status: data.status == 1 ? 2 : 1 });
    const res = await axios.put(
      `${back_url}/toggle/${data.id}`
    );
    props.fetchTasks();
    return;
  };


  const seeMore = async () => {
    Swal.fire({
      title: `${data.title}`,
      text: `${data.description}`,
    })
  }

  const handleDelete = async () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    })
      .then((result) => {
        if (result.isConfirmed) {
          Swal.fire("Deleted!", "Your file has been deleted.", "success");
          axios.delete(`${back_url}/${data.id}`);
        }
      })
      .then(() => {
        props.fetchTasks();
      });
    return;
  };
  

  const handleEdit = async () => {
    const { value: formValues } = await Swal.fire({
      title: 'Edit',
      confirmButtonText: 'Save',
      html:
        "<label> Title:" +
        "<br/>" +
        `<input id="swal-input1" class="swal2-input" value="${data.title}">` +
        "</label>" +
        "<br/>" +
        "<label> Description:" +
        "<br/>" +
        `<input id="swal-input2" class="swal2-input" value="${data.description}">` +
        "</label>" +
        "<br/>" +
        "<label> Status:" +
        `<select id="swal-input3" class="swal2-input" value="${data.status}">` +
        `<option value="1">To Do</option>` +
        `<option value="2">Completed</option>` +
        "</select>" +
        "</label>",
      focusConfirm: false,
      showCancelButton: true,
      preConfirm: () => {
        return {title: (document.getElementById('swal-input1') as HTMLInputElement).value,
          description: (document.getElementById('swal-input2') as HTMLInputElement).value,
          status: + (document.getElementById('swal-input3') as HTMLInputElement).value}
        
      }
    })
    
    if (formValues) {
      const { title, description, status} = formValues
      Swal.fire({
        title: 'Do you want to save the changes?',
        showDenyButton: true,
         confirmButtonText: 'Save',
        denyButtonText: `Don't save`,
      }).then(async (result) => {
        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) {
          await axios.put(`${back_url}/${data.id}`, {
            title,
            description,
            status,
          })
          setData({...data, title, description, status})
          Swal.fire('Saved!', '', 'success')
        } else if (result.isDenied) {
          Swal.fire('Changes are not saved', '', 'info')
        }
      })
    }

  }


  return (
    <ListItem
      secondaryAction={
        <>
        {/* Old Modal opener */}
          {/* <IconButton
            edge="end"
            aria-label="openDescription"
            onClick={() => setDescription(true)}
          >
            <AddCircleIcon />
          </IconButton> */}
          <IconButton
            edge="end"
            aria-label="openDescription"
            onClick={() => seeMore()}
          >
            <AddCircleIcon />
          </IconButton>
          {/* Old Modify modal opener */}
          {/* <IconButton
            edge="end"
            aria-label="openEdit"
            onClick={() => setEdit(true)}
          >
            <EditIcon />
          </IconButton> */}
          <IconButton
            edge="end"
            aria-label="openEdit"
            onClick={() => handleEdit()}
          >
            <EditIcon />
          </IconButton>
          <IconButton
            edge="end"
            aria-label="delete"
            onClick={() => handleDelete()}
          >
            <DeleteIcon />
          </IconButton>

          <Checkbox
            checked={data.status == 2}
            onClick={() => toggleComplete()}
          />
          {/* Unused Modals   */}
          {/* <BasicModal
            open={description}
            handleClose={() => setDescription(false)}
            title={props.title}
            description={props.description}
          /> */}
          {/* <ModifyModal
            open={edit}
            handleClose={() => 
              setEdit(false)
            }
            fetchTasks={props.fetchTasks}
            id={props.id}
            title={props.title}
            description={props.description}
            status={props.status}
          ></ModifyModal> */}
        </>
      }
    >
      <ListItemText
        primary={`${data.title ? data.title : "Loading..."}`}
        // secondary={description ? "Secondary text" : data.id}
      />
    </ListItem>
  );
}
