import { Image, Text, View } from "react-native";
import { GlobalStyles, TextStyles } from "../../styles/Styles";


const HeaderTitle = () => {


    return (
        <View style={[GlobalStyles.flexRow, {alignItems: "center", gap: 8}]}>
        <Image source={require("../../assets/icons/logo.png")} style={{width: 32, height: 32, borderRadius: 8}}></Image>
        <Text style={TextStyles.logoTitle}>Tasky</Text>
        </View>
    )
};


export default HeaderTitle;