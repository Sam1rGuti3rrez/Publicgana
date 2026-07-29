import { View, StyleSheet } from "react-native";
import BalanceCard from "@/components/BalanceCard";
import { colors } from "@/theme/colors";


export default function Home(){

    return(
        <View style={styles.container}>

            <BalanceCard />

        </View>
    );

}


const styles = StyleSheet.create({

    container:{
        flex:1,
        backgroundColor:colors.background,
        padding:20,
        justifyContent:"center"
    }

});