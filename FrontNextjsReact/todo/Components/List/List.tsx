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
import { Pagination } from "../../Types/Types";
import Swal from "sweetalert2";


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


const back_url = process.env.NEXT_PUBLIC_BACK_URL

// const https = require('https');

// const instance = axios.create({
//   httpsAgent: new https.Agent({  
//     rejectUnauthorized: false
//   })
// });

export default function InteractiveList() {
  const [dense, setDense] = React.useState(false);
  // const [openCreate, setOpenCreate] = React.useState(false);
  const [tasks, setTasks] = React.useState([]);
  const [allTasks, setAllTasks] = React.useState([]);
  const [toggleBack, setToggleBack] = React.useState(true);
  const [maxPages, setMaxPages] = React.useState(1);
  const [pagination, setPagination] = React.useState<Pagination>({
    page: 1,
    per_page: 10,
    filterStatus: 0,
  });

  const fetchTasks = async () => {

    if (toggleBack) {
      let tasks = await axios.get(`${back_url}/paginated`, {
        params: {
          page: pagination.page,
          per_page: pagination.per_page,
          status: pagination.filterStatus,
        },
      });
      setMaxPages(Math.ceil(tasks.data[0] / pagination.per_page));
      setTasks([...tasks.data[1]]);
    } else {
      let tasks = await axios.get(`${back_url}`);
      setAllTasks([...tasks.data]);
    }
  };

  const filterTasks = () => {
    const { page, per_page, filterStatus } = pagination;
    let tasks = allTasks.filter((e) => e.status != filterStatus);
    let maxPages = Math.ceil(tasks.length / per_page);
    tasks = tasks.slice((page - 1) * per_page, page * per_page);
    setMaxPages(maxPages);
    setTasks([...tasks]);
  };


  const handleCreate = async () => {
    const { value: formValues } = await Swal.fire({
      title: 'Create',
      confirmButtonText: 'Save',
      html:
        "<label> Title:" +
        "<br/>" +
        `<input id="swal-input1" class="swal2-input">` +
        "</label>" +
        "<br/>" +
        "<label> Description:" +
        "<br/>" +
        `<input id="swal-input2" class="swal2-input">` +
        "</label>" +
        "<br/>" +
        "<label> Status:" +
        `<select id="swal-input3" class="swal2-input" >` +
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
          await axios.post(`${back_url}`, {
            title,
            description,
            status,
          })
          fetchTasks();
          Swal.fire('Saved!', '', 'success')
        } else if (result.isDenied) {
          Swal.fire('Changes are not saved', '', 'info')
        }
      })
    }

  }

  React.useEffect(() => {
    filterTasks();
  }, [allTasks]);

  React.useEffect(() => {
    if (toggleBack) {
      fetchTasks();
      return;
    }
    if (!toggleBack) {
      if (allTasks.length == 0) {
        fetchTasks();
      }
      filterTasks();
      return;
    }
  }, [pagination, toggleBack]);

  return (
    <Box sx={{ flexGrow: 1, maxWidth: 752 }} key={"app"}>
      <FormGroup row key={"row"}>
        <Box key={"toogleBox"}>
          <FormControlLabel
          key={"toggleDense"}
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
          key={"toggleBack"}
            control={
              <Checkbox
                checked={toggleBack}
                onChange={(event) => {
                  if (!toggleBack) {
                    setAllTasks([]);
                  }
                  setToggleBack(event.target.checked);
                }}
              />
            }
            label="Toggle back pagination"
          />
        </Box>
        <FormControlLabel 
        key={"paginationSettings"}
        label={"Settings"}
          control={
            <Box>
              <label key={"page"}>
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
              <label key={"per_page"}>
                {" "}
                Per Page:
                <select
                  value={pagination.per_page}
                  onChange={(e) =>
                    setPagination({ ...pagination, page: 1, per_page: +e.target.value })
                  }
                >
                  {[...Array(10).keys()].map((e) => (
                    <option value={e + 1}>{`${e + 1}`}</option>
                  ))}
                </select>
              </label>
              <br />
              <label key={"filterStatus"}>
                {" "}
                Status:
                <select
                  value={pagination.filterStatus}
                  onChange={(e) =>
                    setPagination({
                      ...pagination,
                      page: 1,
                      filterStatus: +e.target.value,
                    })
                  }
                >
                  <option value={0}>All</option>
                  <option value={2}>To Do</option>
                  <option value={1}>Completed</option>
                </select>
              </label>
            </Box>
          }
        />
        {/* Old create modal opener */}
        {/* <IconButton onClick={() => setOpenCreate(true)}>
          <AddCommentOutlinedIcon />
        </IconButton> */}
        <IconButton onClick={() => handleCreate()}>
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
          {/* {[
            ...Array(
              pagination.per_page - tasks.length > 0
                ? pagination.per_page - tasks.length
                : 0
            ),
          ].map((e) => (
            <Item empty={true}></Item>
          ))} */}
        </List>
      </Demo>
      {/* Old create modal */}
      {/* <NewItem
        open={openCreate}
        handleClose={() => setOpenCreate(false)}
        fetchTasks={fetchTasks}
      ></NewItem> */}
    </Box>
  );
}
