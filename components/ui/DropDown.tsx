import React, { useCallback, useEffect, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { TextStyles } from '../../styles/Styles';

const DropDown = (props: {
  value: string | undefined;
  items: Array<any> | undefined;
  setValue(n: any): void;
}) => {
  const [open, setOpen] = useState(false);

  return (
    <View style={{ zIndex: 10, elevation: 10 }}>
      <Pressable
        onPress={() => {
          setOpen(!open);
        }}>
        <View
          style={{
            elevation: 10,
            backgroundColor: 'rgb(88,88,88)',
            padding: 5,
            borderRadius: 4,
          }}>
          <Text style={TextStyles.white}>{props.value}</Text>
        </View>
      </Pressable>

      {open && (
        <View>
          <View
            style={{
              backgroundColor: 'rgb(88,88,88)',
              position: 'absolute',
              width: '100%',
              paddingHorizontal: 5,
              borderRadius: 4,
            }}>
            {props.items &&
              props.items.map((n: any, index: number) => {
                return (
                  <Pressable
                    key={'press' + index}
                    onPress={() => {
                      props.setValue(n);
                      setOpen(false);
                    }}>
                    <View style={{ padding: 4 }}>
                      <Text style={TextStyles.white}>{n.name}</Text>
                    </View>
                  </Pressable>
                );
              })}
          </View>
        </View>
      )}
    </View>
  );
};

export default DropDown;
