import React, {useEffect, useState} from 'react';
import {Text, View} from 'react-native';
import {Tasklist, Task} from '../../types/tasks';
import {APP_URL} from '@env';

const TaskListing = () => {
  const [taskLists, setTaskLists] = useState<Tasklist[]>();

  useEffect(() => {
    fetch(APP_URL + 'tasks/Index');
  }, []);

  return (
    <View>
      <Text>Hello</Text>
    </View>
  );
};

export default TaskListing;
