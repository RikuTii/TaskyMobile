import { StyleSheet } from "react-native";


const textColor = "rgb(200,200,200)"

export const GlobalStyles = StyleSheet.create({
   flexRow: {
    flexDirection: 'row',
   },
   center: {
    alignItems: 'center',
    justifyContent: 'center'
   },
   mr8: {
      marginRight: 8
   },
   mr4: {
      marginRight: 4
   },
   backGroundColor: {
      backgroundColor: "black",
   },
  });

  export const TextStyles = StyleSheet.create({
   white: {
      color: textColor,
   },
   mainTitle: {
      color: textColor,
      fontSize: 20,
   },
   subTitle: {
      color: textColor,
      fontSize: 16,
   },
   logoTitle: {
      color: textColor,
      fontSize: 20,
      fontWeight: "700",
      fontFamily: 'Roboto, sans-serif',
   },
  });

export const InputStyles = StyleSheet.create({
   container: {
      backgroundColor: 'rgb(60,60,60)',
      borderRadius: 4,
      alignItems: 'flex-start',
      justifyContent: 'center',
      color: textColor,
      borderBottomWidth: 2,
      borderColor: 'rgb(124,124,124)',
      marginVertical: 4,
      padding: 0,
      margin: 4,
      
   },
   title: {
      fontSize: 16,
      color: textColor,
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
