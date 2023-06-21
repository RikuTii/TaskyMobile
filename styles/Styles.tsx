import { StyleSheet } from "react-native";

export const GlobalStyles = StyleSheet.create({
   flexRow: {
    flexDirection: 'row',
   },
   center: {
    alignItems: 'center',
    justifyContent: 'center'
   },
  });

  export const TextStyles = StyleSheet.create({
   white: {
      color: 'rgb(245,245,245)',
   },
   mainTitle: {
      color: 'rgb(245,245,245)',
      fontSize: 20,
   }
  });

export const InputStyles = StyleSheet.create({
   container: {
      backgroundColor: 'rgb(60,60,60)',
      borderRadius: 4,
      alignItems: 'flex-start',
      justifyContent: 'center',
      color: 'rgb(245,245,245)',
      borderBottomWidth: 2,
      borderColor: 'rgb(124,124,124)',
      marginVertical: 4,
      padding: 0,
      margin: 4,
   },
   title: {
      fontSize: 16,
      color: 'rgb(245,245,245)',
   },
   button: {
      backgroundColor: 'rgb(60,60,150)',
      borderRadius: 4,
      alignItems: 'flex-start',
      justifyContent: 'center',
      padding: 10,
      margin: 4,
      elevation: 10,
   }
});