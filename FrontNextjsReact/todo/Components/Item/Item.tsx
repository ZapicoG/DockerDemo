import * as React from "react";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import EditIcon from "@mui/icons-material/Edit";
import Checkbox from "@mui/material/Checkbox";
import BasicModal from "../Modal/BasicModal";
import ModifyModal from "../ModifyModal/ModifyModal";
import axios from "axios";
import Swal from "sweetalert2";
import { Item as ItemType } from "../../Types/Types";


const back_url = "http://3.143.218.76/tasks"

export default function Item(props) {
  const [data, setData] = React.useState<ItemType>({
    id: props.id,
    title: props.title,
    description: props.description,
    status: props.status,
  });

  const [description, setDescription] = React.useState(false);
  const [edit, setEdit] = React.useState(false);


  const https = require('https');

  const instance = axios.create({
    httpsAgent: new https.Agent({  
      rejectUnauthorized: false
    })
  });


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
          instance.delete(`${back_url}/${data.id}`);
        }
      })
      .then(() => {
        props.fetchTasks();
      });
    return;
  };
  const toggleComplete = async () => {
    setData({ ...data, status: data.status == 1 ? 2 : 1 });
    const res = await instance.put(
      `${back_url}/toggle/${data.id}`
    );
    props.fetchTasks();
    return;
  };

  return (
    <ListItem
      secondaryAction={
        <>
          <IconButton
            edge="end"
            aria-label="openDescription"
            onClick={() => setDescription(true)}
          >
            <AddCircleIcon />
          </IconButton>
          <IconButton
            edge="end"
            aria-label="openEdit"
            onClick={() => setEdit(true)}
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
          <BasicModal
            open={description}
            handleClose={() => setDescription(false)}
            title={props.title}
            description={props.description}
          ></BasicModal>
          <ModifyModal
            open={edit}
            handleClose={() => 
              setEdit(false)
            }
            fetchTasks={props.fetchTasks}
            id={props.id}
            title={props.title}
            description={props.description}
            status={props.status}
          ></ModifyModal>
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
