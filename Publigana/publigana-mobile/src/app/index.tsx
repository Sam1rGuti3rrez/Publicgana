import { View, Text, StyleSheet, ScrollView } from "react-native";
import BalanceCard from "@/components/BalanceCard";
import { colors } from "@/theme/colors";


export default function Home() {

  return (
      <ScrollView
          style={styles.container}
          showsVerticalScrollIndicator={false}
      >

        <View style={styles.header}>

          <Text style={styles.greeting}>
            Hola 👋
          </Text>

          <Text style={styles.name}>
            Bienvenido a Publigana
          </Text>

          <Text style={styles.subtitle}>
            Gestiona tus campañas y ganancias
          </Text>

        </View>


        <BalanceCard />


        <Text style={styles.sectionTitle}>
          Acciones rápidas
        </Text>


        <View style={styles.actions}>

          <View style={styles.actionCard}>
            <Text style={styles.actionTitle}>
              📢 Campañas
            </Text>

            <Text style={styles.actionText}>
              Explora nuevas oportunidades
            </Text>
          </View>


          <View style={styles.actionCard}>
            <Text style={styles.actionTitle}>
              💰 Ganancias
            </Text>

            <Text style={styles.actionText}>
              Revisa tus ingresos
            </Text>
          </View>

        </View>


        <Text style={styles.sectionTitle}>
          Campañas disponibles
        </Text>


      </ScrollView>
  );
}


const styles = StyleSheet.create({

  container:{
    flex:1,
    backgroundColor: colors.background,
    paddingHorizontal:20,
  },


  header:{
    marginTop:50,
    marginBottom:25,
  },


  greeting:{
    color:colors.gray400,
    fontSize:16,
  },


  name:{
    color:colors.white,
    fontSize:28,
    fontWeight:"bold",
    marginTop:5,
  },


  subtitle:{
    color:colors.gray400,
    marginTop:8,
    fontSize:15,
  },


  sectionTitle:{
    color:colors.white,
    fontSize:20,
    fontWeight:"bold",
    marginTop:30,
    marginBottom:15,
  },


  actions:{
    flexDirection:"row",
    justifyContent:"space-between",
  },


  actionCard:{
    backgroundColor:colors.surface,
    width:"48%",
    padding:16,
    borderRadius:18,
    borderWidth:1,
    borderColor:colors.border,
  },


  actionTitle:{
    color:colors.white,
    fontSize:16,
    fontWeight:"bold",
  },


  actionText:{
    color:colors.gray400,
    marginTop:8,
    fontSize:13,
  }

});