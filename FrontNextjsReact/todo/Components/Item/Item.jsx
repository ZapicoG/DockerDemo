import * as React from "react";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import EditIcon from "@mui/icons-material/Edit";
import Checkbox from "@mui/material/Checkbox";
import BasicModal from "../Modal/BasicModal";
import ModifyModal from "../../ModifyModal/ModifyModal";
import axios from "axios";

export default function Item(props) {
  const [data, setData] = React.useState({
    id: props.id,
    title: props.title,
    description: props.description,
    status: props.status,
  });

  const [description, setDescription] = React.useState(false);
  const [edit, setEdit] = React.useState(false);

  const handleEdit = async (data) => {
    const res = await axios.put(`http://localhost:5000/tasks/${data.id}`, {
      title: data.title,
      description: data.description,
      status: data.status,
    });
    props.fetchTasks();
    return;
  };
  const handleDelete = async () => {
    const res = await axios.delete(`http://localhost:5000/tasks/${data.id}`);
    props.fetchTasks();
    return;
  };
  const toggleComplete = async () => {
    setData({ ...data, status: data.status == 1 ? 2 : 1 });
    const res = await axios.put(
      `http://localhost:5000/tasks/toggle/${data.id}`
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
            handleClose={() => setEdit(false)}
            handleEdit={handleEdit}
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
        secondary={description ? "Secondary text" : data.id}
      />
    </ListItem>
  );
}
