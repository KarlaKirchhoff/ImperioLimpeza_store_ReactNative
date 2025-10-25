import { Image, StyleSheet, Text, View } from "react-native";
import Logo from "../../../assets/icon.png"


export default function HeaderComponent(){
    return (
        <View>
            <Image style={styles.logo} source={Logo}/>
        </View>
    )
}

const styles = StyleSheet.create({
  logo: {
    width: 80,
    height: 80
  },
});
