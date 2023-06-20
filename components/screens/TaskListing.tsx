import React, { useCallback, useEffect, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { Tasklist, Task } from '../../types/tasks';
import { axiosInstance } from '../Axios';
import { GlobalStyles } from '../../styles/Styles';
import Icon from 'react-native-vector-icons/FontAwesome';
import { TextInput } from 'react-native-gesture-handler';
import { TaskStatus } from '../../types/enum';
import { debounce } from 'lodash';
import DropDown from '../ui/DropDown';

const TaskListing = () => {
  const [taskLists, setTaskLists] = useState<Tasklist[]>();
  const [selectedTaskList, setSelectedTaskList] = useState<Tasklist | null>();
  const [tasks, setTasks] = useState<Array<Task> | null>(null);

  const getTaskLists = async () => {
    await axiosInstance
      .get('tasks/Index')
      .then(response => {
        setTaskLists(JSON.parse(response.data));
        setTasks(JSON.parse(response.data)[0]?.tasks);
      })
      .catch(err => {
        console.log(err);
      });
  };

  useEffect(() => {
    getTaskLists();
  }, []);

  useEffect(() => {
    setSelectedTaskList(taskLists ? taskLists[0] : null);
  }, [taskLists]);

  const delayedTaskUpdate = useCallback(
    debounce((q: Task) => onTaskUpdated(q), 1000),
    [],
  );

  const onTaskUpdated = async (task: Task, orderId: number = 0) => {
    const data = JSON.stringify({
      title: task?.title,
      id: task?.id,
      status: task?.status,
      taskListId: task?.taskListID ?? task?.taskList?.id,
      order_task: orderId ?? 0,
    });
    axiosInstance
      .post('task/CreateOrUpdateTask', data)
      .then(() => {
        //refreshTaskLists(task?.taskListID ?? task?.taskList?.id ?? 0);
        getTaskLists();
      })
      .catch(err => {
        console.log(err.message);
      });
  };

  return (
    <View style={{ padding: 5 }}>
      <DropDown
        items={taskLists}
        value={selectedTaskList?.name}
        setValue={(n: any) => {
          setSelectedTaskList(n);
        }}/>

      {tasks &&
        tasks?.map((task: Task) => (
          <View
            key={task.id}
            style={[GlobalStyles.flexRow, { alignItems: 'center' }]}>
            <Icon name="list" size={14} color="white" />
            <TextInput
              value={task.title}
              onChangeText={(text: string) => {
                const newTasks = [...tasks];
                const currentTask = newTasks.find(e => e.id === task.id);
                if (currentTask) {
                  currentTask.title = text;
                  setTasks(newTasks);
                }
                delayedTaskUpdate(task);
              }}
              style={{
                color: 'white',
                marginLeft: 8,
                width: 100,
                height: 35,
                borderColor: 'white',
                borderRadius: 2,
              }}
            />
            <Pressable
              onPress={() => {
                if (task.status != TaskStatus.Done) {
                  task.status = TaskStatus.Done;
                } else {
                  task.status = TaskStatus.NotDone;
                }

                const newTasks = [...tasks];
                const currentTask = newTasks.find(e => e.id === task.id);
                if (currentTask) {
                  currentTask.status = task.status;
                  setTasks(newTasks);
                }
                delayedTaskUpdate(task);
              }}>
              <View
                style={{
                  borderColor: 'white',
                  borderWidth: 2,
                  width: 18,
                  height: 18,
                }}>
                {task?.status == TaskStatus.Done && (
                  <Icon name="check" size={14} color="white" />
                )}
              </View>
            </Pressable>
          </View>
        ))}
    </View>
  );
};

export default TaskListing;
