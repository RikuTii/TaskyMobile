import React, {useEffect, useState} from 'react';
import {Text, View} from 'react-native';
import {Tasklist, Task} from '../../types/tasks';
import { axiosInstance } from '../Axios';

const TaskListing = () => {
  const [taskLists, setTaskLists] = useState<Tasklist[]>();
  const [selectedTaskList, setSelectedTaskList] = useState<Tasklist | null>();

  const getTaskLists = async () => {
    await axiosInstance
      .get('tasks/Index')
      .then(response => {
        setTaskLists(JSON.parse(response.data));
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
  },[taskLists]);

  return (
    <View>
      {selectedTaskList?.tasks?.map((task: Task) => (
        <View key={task.id}>
        <Text style={{color:'white'}}>{task.title}</Text>
        </View>
      ))}
    </View>
  );
};

export default TaskListing;
