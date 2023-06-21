import React, { useContext, useEffect, useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';
import { TextStyles, InputStyles } from '../../styles/Styles';
import { axiosInstance } from '../Axios';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types/global';

type Props = NativeStackScreenProps<RootStackParamList, 'CreateTaskList'>;

const CreateTaskList = ({ navigation, route }: Props) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const createTaskList = async () => {
    const data = JSON.stringify({
      Name: title,
      Description: description,
    });
    axiosInstance
      .post('tasks/CreateTaskList', data)
      .then(() => {
        navigation.navigate('TaskListing');
      })
      .catch(err => {
        console.log(err.message);
      });
  };

  return (
    <View>
      <Text style={InputStyles.title}>Name</Text>
      <TextInput
        onChangeText={(text: string) => {
          setTitle(text);
        }}
        value={title}
        style={InputStyles.container}
      />
      <Text style={InputStyles.title}>Description</Text>
      <TextInput
        onChangeText={(text: string) => {
          setDescription(text);
        }}
        value={description}
        style={InputStyles.container}
      />
      <Pressable onPress={createTaskList}>
        <View style={[InputStyles.button, { marginLeft: 'auto' }]}>
          <Text style={InputStyles.title}>Create</Text>
        </View>
      </Pressable>
    </View>
  );
};

export default CreateTaskList;
