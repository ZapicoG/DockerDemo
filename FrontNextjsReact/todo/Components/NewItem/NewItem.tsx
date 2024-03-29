import * as React from "react";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Modal from "@mui/material/Modal";
import SaveIcon from "@mui/icons-material/Save";
import axios from "axios";
import { Item } from "../../Types/Types";



const back_url = process.env.NEXT_PUBLIC_BACK_URL

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

export default function NewItem(props) {
  //   const [open, setOpen] = React.useState(false);
  //   const handleOpen = () => setOpen(true);
  //   const handleClose = () => setOpen(false);
  let open = props.open;
  let handleClose = props.handleClose;
  const [data, setData] = React.useState<Item>({
    title: null,
    description: null,
    status: 1,
  });


  // const https = require('https');

  // const instance = axios.create({
  //   httpsAgent: new https.Agent({  
  //     rejectUnauthorized: false
  //   })
  // });


  const handleCreate = async () => {
    const res = await axios.post(`${back_url}`, {
      title: data.title,
      description: data.description,
      status: data.status,
    });
    props.fetchTasks()
  };

  const handleChange = (event) => {
    setData({ ...data, [event.target.name]: event.target.value });
  };
  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <form action="">
            <label>
              Title:
              <input
                name="title"
                type="string"
                value={data.title}
                onChange={handleChange}
              />
            </label>
            <br />
            <label>
              Description:
              <input
                name="description"
                type="string"
                value={data.description}
                onChange={handleChange}
              />
            </label>
            <label>
              Status:
              <select
                name="status"

                value={data.status}
                onChange={handleChange}
              >
                <option value="1">To Do</option>
                <option value="2">Completed</option>
              </select>
            </label>
            <br />
            <IconButton
              edge="end"
              aria-label="create"
              onClick={() => {
                handleCreate();
                handleClose(false);
              }}
            >
              <SaveIcon />
            </IconButton>
          </form>
        </Box>
      </Modal>
    </div>
  );
}
