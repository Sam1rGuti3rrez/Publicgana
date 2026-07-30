import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { colors } from "@/theme/colors";

interface BalanceCardProps {
  userName?: string;
}

export default function BalanceCard({ userName = "Usuario" }: BalanceCardProps) {

  const initial = userName.charAt(0).toUpperCase();

  return (
    <View style={styles.card}>

      {/* Logo y perfil */}
      <View style={styles.header}>

        <Text style={styles.logo}>
          Publigana
        </Text>

        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {initial}
          </Text>
        </View>

      </View>


      {/* Saldo */}
      <Text style={styles.label}>
        Saldo disponible
      </Text>

      <Text style={styles.amount}>
        $125.000
      </Text>

      <Text style={styles.info}>
        +12% este mes
      </Text>


      {/* Retiro */}
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>
          Retirar dinero
        </Text>
      </TouchableOpacity>

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


  header:{
    flexDirection:"row",
    justifyContent:"space-between",
    alignItems:"center",
    marginBottom:25,
  },


  logo:{
    color:colors.white,
    fontSize:22,
    fontWeight:"bold",
  },


  avatar:{
    width:45,
    height:45,
    borderRadius:50,
    backgroundColor:"#FFD166",
    justifyContent:"center",
    alignItems:"center",
  },


  avatarText:{
    color:"#24103A",
    fontSize:20,
    fontWeight:"bold",
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
  },


  button:{
    backgroundColor:"#FFD166",
    marginTop:20,
    paddingVertical:14,
    borderRadius:16,
    alignItems:"center",
  },


  buttonText:{
    color:"#24103A",
    fontSize:16,
    fontWeight:"bold",
  },

});