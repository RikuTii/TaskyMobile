import React, {useEffect, useState} from 'react';
import {Text, View} from 'react-native';
import {Tasklist, Task} from '../../types/tasks';
import { axiosInstance } from '../Axios';
import { GlobalStyles } from '../../styles/Styles';
import Icon from 'react-native-vector-icons/FontAwesome';
import { TextInput } from 'react-native-gesture-handler';
import { TaskStatus } from '../../types/enum';



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
    <View style={{padding: 5}}>
      {selectedTaskList?.tasks?.map((task: Task) => (
        <View key={task.id} style={[GlobalStyles.flexRow, {alignItems: 'center'}]}>
          <Icon name="list" size={14} color="white" />
          <TextInput value={task.title} style={{color:'white', marginLeft: 8, width: 100, height: 35, borderColor: 'white', borderRadius: 2}}/>
          <View style={{borderColor: 'white', borderWidth: 2, width: 18, height: 18}}>
            {task.status == TaskStatus.Done && (
              <Icon name="check" size={14} color="white" />
            )}
          </View>
        </View>
      ))}
    </View>
  );
};

export default TaskListing;
