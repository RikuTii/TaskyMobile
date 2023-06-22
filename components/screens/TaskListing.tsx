import React, { useCallback, useEffect, useState } from 'react';
import { Pressable, Text, View, KeyboardAvoidingView, Keyboard } from 'react-native';
import { Tasklist, Task } from '../../types/tasks';
import { axiosInstance } from '../Axios';
import { GlobalStyles } from '../../styles/Styles';
import Icon from 'react-native-vector-icons/FontAwesome';
import { TextInput } from 'react-native-gesture-handler';
import { TaskStatus } from '../../types/enum';
import { debounce, forEach } from 'lodash';
import DropDown from '../ui/DropDown';
import DraggableFlatList, {
  RenderItemParams,
} from 'react-native-draggable-flatlist';
import { useFocusEffect } from '@react-navigation/native';

const TaskListing = () => {
  const [taskLists, setTaskLists] = useState<Tasklist[]>();
  const [selectedTaskList, setSelectedTaskList] = useState<Tasklist | null>();
  const [tasks, setTasks] = useState<Array<Task> | null>(null);


  Keyboard.addListener('keyboardDidHide', () => {
    Keyboard.dismiss();
  });

  const getTaskLists = async () => {
    await axiosInstance
      .get('tasks/Index')
      .then(response => {
        const data = JSON.parse(response.data);
        setTaskLists(data);
        setSelectedTaskList(data[0]);
      })
      .catch(err => {
        console.log(err);
      });
  };

  useFocusEffect(
    useCallback(() => {
      getTaskLists();
    }, []),
  );

  useEffect(() => {
    if (selectedTaskList?.tasks) setTasks(selectedTaskList.tasks);
  }, [selectedTaskList]);

  const createNewTask = () => {
    if (selectedTaskList) {
      let id = 1;
      if (tasks && tasks?.length > 0) {
        tasks.forEach((task: Task) => {
          if (task.id && task.id > id) {
            id = task.id;
          }
        });
      }
      let nextId = id + 1;

      const newTask: Task = {
        id: nextId,
        title: '',
        createdDate: new Date().toISOString(),
        status: TaskStatus.NotCreated,
        taskList: selectedTaskList,
        taskListID: selectedTaskList?.id,
        creator: null
      };
      if (tasks) {
        const newTasks = [...tasks];
        newTasks.push(newTask);
        setTasks(newTasks);
      }
    }
  };

  const refreshTaskLists = async (id: number) => {
    await axiosInstance
      .get('tasks/Index')
      .then(response => {
        const data = JSON.parse(response.data);
        setTaskLists(data);
        forEach(data, (taskList: Tasklist) => {
          if (taskList.id == id) {
            setSelectedTaskList(taskList);
          }
        });
      })
      .catch(err => {
        console.log(err);
      });
  };

  const refreshActiveTaskList = async (id: number) => {
    await axiosInstance
      .get('tasks/TaskList', {
        params: {
          taskListId: id,
        },
      })
      .then(response => {
        setSelectedTaskList(response.data);
      })
      .catch(err => {
        console.log(err);
      });
  };

  const delayedTaskUpdate = useCallback(
    debounce((q: Task) => onTaskUpdated(q), 1000),
    [],
  );

  const reOrderTasks = async (orderedTasks: Task[]) => {
    const data = JSON.stringify({
      tasks: orderedTasks,
      taskListId: selectedTaskList?.id,
    });
    axiosInstance
      .post('task/ReOrderTasks', data)
      .then(() => {
        if (orderedTasks)
          refreshTaskLists(
            orderedTasks[0]?.taskListID ?? orderedTasks[0]?.taskList?.id ?? 0,
          );
      })
      .catch(err => {
        console.log(err.message);
      });
  };

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
        refreshTaskLists(task?.taskListID ?? task?.taskList?.id ?? 0);
      })
      .catch(err => {
        console.log(err.message);
      });
  };

  const renderItem = ({ item, drag, isActive }: RenderItemParams<Task>) => {
    const task = item;
    return (
      <Pressable onLongPress={drag}>
        <View
          key={task.id}
          style={[
            GlobalStyles.flexRow,
            { alignItems: 'center', alignContent: 'center' },
            isActive ? { backgroundColor: 'rgba(30,30,30,0.5)' } : {},
          ]}>
          <Icon name="list" size={16} color="white" />
          <TextInput
            value={task.title}
            onChangeText={(text: string) => {
              const newTasks = [...(tasks ?? [])];
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
              padding: 4,
              width: 100,
              alignSelf: 'center'
            }}
          />
          <Pressable
            onPress={() => {
              if (task.status != TaskStatus.Done) {
                task.status = TaskStatus.Done;
              } else {
                task.status = TaskStatus.NotDone;
              }
              const newTasks = [...(tasks ?? [])];
              const currentTask = newTasks.find(e => e.id === task.id);
              if (currentTask) {
                currentTask.status = task.status;
                setTasks(newTasks);
              }
              onTaskUpdated(task);
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
      </Pressable>
    );
  };

  if (!taskLists || !tasks) return <></>;

  return (
    <KeyboardAvoidingView
      behavior={'position'}
      keyboardVerticalOffset={100}
      style={{ padding: 5 }}>
      <DropDown
        items={taskLists}
        value={selectedTaskList?.name}
        setValue={(n: Tasklist) => {
          setSelectedTaskList(n);
          refreshActiveTaskList(n.id ?? 0);
        }}
      />
      <DraggableFlatList
        data={tasks}
        onDragEnd={({ data }) => {
          setTasks(data);
          reOrderTasks(data);
        }}
        keyExtractor={item => 'key' + item.id}
        renderItem={renderItem}
      />

      <Pressable onPress={createNewTask}>
        <View
          style={{
            position: 'absolute',
            right: 50,
            bottom: 0,
            borderRadius: 50,
            backgroundColor: 'gray',
            height: 50,
            width: 50,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Icon name="plus" size={25} color="white" />
        </View>
      </Pressable>
    </KeyboardAvoidingView>
  );
};

export default TaskListing;
