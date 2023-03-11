import * as React from "react";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import Item from "../Item/Item";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import axios from "axios";
import IconButton from "@mui/material/IconButton";
import AddCommentOutlinedIcon from "@mui/icons-material/AddCommentOutlined";
import NewItem from "../NewItem/NewItem";
// function generate(element) {
//   return [0, 1, 2].map((value) =>
//     React.cloneElement(element, {
//       key: value,
//     })
//   );
// }

const Demo = styled("div")(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
}));

export default function InteractiveList() {
  const [dense, setDense] = React.useState(false);
  const [openCreate, setOpenCreate] = React.useState(false);
  const [tasks, setTasks] = React.useState([]);
  const [toggleBack, setToggleBack] = React.useState(true);
  const [maxPages, setMaxPages] = React.useState(1);
  const [pagination, setPagination] = React.useState({
    page: 1,
    per_page: 10,
    status: 0,
  });

  const fetchTasks = async () => {
    if (toggleBack) {
      let tasks = await axios.get("http://localhost:5000/tasks/paginated", {
        params: {
          page: pagination.page,
          per_page: pagination.per_page,
          status: pagination.status,
        },
      });
      setMaxPages(Math.ceil(tasks.data[0] / pagination.per_page));
      setTasks([...tasks.data[1]]);
    } else {
      let tasks = await axios.get("http://localhost:5000/tasks");
      setTasks(tasks.data);
    }
  };

  React.useEffect(() => {
    fetchTasks();
  }, [pagination, toggleBack]);

  return (
    <Box sx={{ flexGrow: 1, maxWidth: 752 }}>
      <FormGroup row>
        <Box>
          <FormControlLabel
            control={
              <Checkbox
                checked={dense}
                onChange={(event) => setDense(event.target.checked)}
              />
            }
            label="Enable dense"
          />
          <br />
          <FormControlLabel
            control={
              <Checkbox
                checked={toggleBack}
                onChange={(event) => {
                  setToggleBack(event.target.checked);
                }}
              />
            }
            label="Toggle back pagination"
          />
        </Box>
        <FormControlLabel
          control={
            <Box>
              <label>
                {" "}
                Page:
                <select
                  onChange={(e) =>
                    setPagination({ ...pagination, page: +e.target.value + 1 })
                  }
                >
                  {[...Array(maxPages).keys()].map((e) => (
                    <option value={e}>{`${e}`}</option>
                  ))}
                </select>
              </label>
              <br />
              <label>
                {" "}
                Per Page:
                <select
                  value={pagination.per_page}
                  onChange={(e) =>
                    setPagination({ ...pagination, per_page: e.target.value })
                  }
                >
                  {[...Array(10).keys()].map((e) => (
                    <option value={e + 1}>{`${e + 1}`}</option>
                  ))}
                </select>
              </label>
              <br />
              <label>
                {" "}
                Status:
                <select
                  value={pagination.status}
                  onChange={(e) =>
                    setPagination({
                      ...pagination,
                      page: 1,
                      status: e.target.value,
                    })
                  }
                >
                  <option value="0">All</option>
                  <option value="2">To Do</option>
                  <option value="1">Completed</option>
                </select>
              </label>
            </Box>
          }
        />
        <IconButton onClick={() => setOpenCreate(true)}>
          <AddCommentOutlinedIcon />
        </IconButton>
      </FormGroup>

      <Demo>
        <List dense={dense}>
          {tasks.map((e) => (
            <Item
              id={e.id}
              title={e.title}
              description={e.description}
              status={e.status}
              fetchTasks={fetchTasks}
              key={e.id}
            />
          ))}
        </List>
      </Demo>
      <NewItem
        open={openCreate}
        handleClose={() => setOpenCreate(false)}
      ></NewItem>
    </Box>
  );
}
