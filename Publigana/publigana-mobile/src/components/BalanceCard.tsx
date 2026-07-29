import { View, Text, StyleSheet } from "react-native";
import { colors } from "@/theme/colors";

export default function BalanceCard(){

    return(
        <View style={styles.card}>

            <Text style={styles.label}>
                Ganancias disponibles
            </Text>

            <Text style={styles.amount}>
                $125.000
            </Text>

            <Text style={styles.info}>
                +12% este mes
            </Text>

        </View>
    );
}


const styles = StyleSheet.create({

    card:{
        backgroundColor: colors.card,
        borderRadius:24,
        padding:24,
        borderWidth:1,
        borderColor:colors.border,
    },

    label:{
        color:colors.gray400,
        fontSize:16,
    },

    amount:{
        color:colors.white,
        fontSize:32,
        fontWeight:"bold",
        marginTop:10,
    },

    info:{
        color:colors.success,
        marginTop:8,
    }

});