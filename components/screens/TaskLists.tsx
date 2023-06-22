import React, { useCallback, useEffect, useState } from 'react';
import {
  Pressable,
  Text,
  View,
  KeyboardAvoidingView,
  Keyboard,
  ListRenderItem,
  Modal,
  StyleSheet,
  TextInput,
} from 'react-native';
import { Tasklist, Task } from '../../types/tasks';
import { axiosInstance } from '../Axios';
import { GlobalStyles, InputStyles, TextStyles } from '../../styles/Styles';
import { FlatList } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useFocusEffect, useScrollToTop } from '@react-navigation/native';
import { text } from '@fortawesome/fontawesome-svg-core';

const TaskLists = (): React.JSX.Element => {
  const [tasklists, setTaskLists] = useState<Array<Tasklist>>([]);
  const [shareableList, setShareableList] = useState<Tasklist>();
  const [modalOpen, setModalOpen] = useState(false);
  const [shareEmail, setShareEmail] = useState('');

  const getTaskLists = async () => {
    await axiosInstance
      .get('tasks/Index')
      .then(response => {
        const data = JSON.parse(response.data);
        setTaskLists(data);
        if (shareableList) {
          data.forEach((list: Tasklist) => {
            if (list.id == shareableList.id) {
              setShareableList(list);
            }
          });
        }
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

  const shareTaskList = () => {
    setShareEmail('');
    const data = JSON.stringify({
      id: shareableList?.id,
      email: shareEmail,
    });
    axiosInstance
      .post('tasks/ShareTaskList', data)
      .then(() => {
        getTaskLists();
      })
      .catch(err => {
        console.log(err.message);
      });
  };

  const removeTaskListShare = (email: string) => {
    const data = JSON.stringify({
      id: shareableList?.id,
      email: email,
    });
    axiosInstance
      .post('tasks/RemoveShareTaskList', data)
      .then(() => {
        getTaskLists();
      })
      .catch(err => {
        console.log(err.message);
      });
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleString();
  };

  const renderTaskList: ListRenderItem<Tasklist> = ({ item }) => (
    <View style={{ padding: 4 }}>
      <View style={GlobalStyles.flexRow}>
        <Text style={[TextStyles.white, GlobalStyles.mr4]}>{item.name}</Text>
        <Text style={[TextStyles.white, GlobalStyles.mr4]}>
          {formatDate(item.createdDate)}
        </Text>
      </View>
      <View style={GlobalStyles.flexRow}>
        <Text style={[TextStyles.white, GlobalStyles.mr4]}>
          {item.creator ? item.creator.firstName : 0}
        </Text>
        <Pressable
          onPress={() => {
            setModalOpen(true);
            setShareableList(item);
          }}>
          <View style={GlobalStyles.mr4}>
            <Icon name="share" size={20} color="white" />
          </View>
        </Pressable>
        <Pressable onPress={() => {}}>
          <View style={GlobalStyles.mr4}>
            <Icon name="trash" size={20} color="red" />
          </View>
        </Pressable>
      </View>
    </View>
  );

  return (
    <View>
      <View style={{ padding: 4 }}>
        <FlatList
          data={tasklists}
          renderItem={renderTaskList}
          keyExtractor={list => String(list.id)}
        />
      </View>

      <Modal
        transparent={true}
        visible={modalOpen}
        animationType="fade"
        onRequestClose={() => setModalOpen(!modalOpen)}>
        <View style={styles.modalBackground}>
          <View style={styles.modalBase}>
            <View style={styles.header}>
              <Text style={TextStyles.mainTitle}>Share tasklist</Text>
              <Pressable onPress={() => setModalOpen(false)}>
                <View
                  style={{
                    width: 25,
                    height: 25,
                    borderRadius: 50,
                    borderColor: 'white',
                    borderWidth: 1,
                    justifyContent: 'flex-start',
                    alignItems: 'center',
                  }}>
                  <Text style={[TextStyles.mainTitle]}>x</Text>
                </View>
              </Pressable>
            </View>
            <View style={{ padding: 4 }}>
              <Text style={TextStyles.subTitle}>{shareableList?.name}</Text>
              <Text style={InputStyles.title}>Email</Text>
              <TextInput
                onChangeText={(text: string) => {
                  setShareEmail(text);
                }}
                value={shareEmail}
                style={InputStyles.container}
              />
              <Pressable onPress={shareTaskList}>
                <View style={[InputStyles.button, { marginLeft: 'auto' }]}>
                  <Text style={InputStyles.title}>Share</Text>
                </View>
              </Pressable>
              {shareableList &&
                shareableList.taskListMetas &&
                shareableList?.taskListMetas.map((meta: any) => (
                  <View key={meta.userAccount.id} style={GlobalStyles.flexRow}>
                    <Text
                      style={[
                        TextStyles.white,
                        { fontWeight: 'bold', marginRight: 4 },
                      ]}>
                      {meta.userAccount.firstName}
                    </Text>
                    <Text style={[TextStyles.white, { marginRight: 8 }]}>
                      {meta.userAccount.email}
                    </Text>
                    <Pressable
                      onPress={() => {
                        removeTaskListShare(meta.userAccount.email);
                      }}>
                      <Text
                        style={{
                          fontWeight: 'bold',
                          color: 'rgb(40,40,40)',
                          fontSize: 20,
                        }}>
                        X
                      </Text>
                    </Pressable>
                  </View>
                ))}
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  modalBackground: {
    backgroundColor: 'rgba(40,40,40,0.60)',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  modalBase: {
    alignSelf: 'center',
    backgroundColor: 'rgb(88,88,88)',
    width: '90%',
    height: '70%',
  },
  header: {
    height: 30,
    backgroundColor: 'rgb(40,40,40)',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export default TaskLists;
