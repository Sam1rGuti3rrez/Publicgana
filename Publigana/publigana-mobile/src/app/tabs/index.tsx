import { View, Text, StyleSheet, ScrollView, Pressable } from "react-native";
import { useState } from "react";
import BalanceCard from "@/components/BalanceCard";
import { colors } from "@/theme/colors";

export default function Home() {

  const [mode, setMode] = useState<"usuario" | "empresa">("usuario");


  return (

    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >


      {/* Selector Influencer / Empresa */}

      <View style={styles.switchContainer}>


        <Pressable
          onPress={() => setMode("usuario")}
          style={[
            styles.switchButton,
            mode === "usuario" && styles.activeButton
          ]}
        >

          <Text
            style={[
              styles.switchText,
              mode === "usuario" && styles.activeText
            ]}
          >
            👤 Influencer/Usuario
          </Text>

        </Pressable>



        <Pressable
          onPress={() => setMode("empresa")}
          style={[
            styles.switchButton,
            mode === "empresa" && styles.activeButton
          ]}
        >

          <Text
            style={[
              styles.switchText,
              mode === "empresa" && styles.activeText
            ]}
          >
            🏢 Portal Empresa
          </Text>

        </Pressable>


      </View>



      {mode === "usuario" ? (

        <>


          {/* Saldo + Logo + Perfil */}

          <BalanceCard userName="Brian" />



          {/* Estadísticas */}

          <View style={styles.statsContainer}>


            <View style={styles.statCard}>

              <Text style={styles.statIcon}>
                📸
              </Text>

              <Text style={styles.statTitle}>
                Publicaciones hoy
              </Text>

              <Text style={styles.statValue}>
                8
              </Text>

            </View>



            <View style={styles.statCard}>

              <Text style={styles.statIcon}>
                💰
              </Text>

              <Text style={styles.statTitle}>
                Ganado hoy
              </Text>

              <Text style={styles.statValue}>
                $1.500
              </Text>

            </View>


          </View>




          {/* Redes conectadas */}

          <Text style={styles.sectionTitle}>
            Redes conectadas
          </Text>



          <View style={styles.card}>


            <Text style={styles.network}>
              🟣 Instagram
            </Text>


            <Text style={styles.network}>
              🔵 Facebook
            </Text>


            <Text style={styles.network}>
              ⚫ TikTok
            </Text>



            <Text style={styles.rank}>
              ⭐ Rango: Pro
            </Text>


          </View>





          {/* Actividad reciente */}

          <Text style={styles.sectionTitle}>
            Actividad reciente
          </Text>



          <View style={styles.card}>


            <Text style={styles.activityTitle}>
              📸 Publicación compartida
            </Text>


            <Text style={styles.activityText}>
              Instagram • Hoy
            </Text>


            <Text style={styles.money}>
              Ganaste +$1.500
            </Text>



            <View style={styles.divider}/>



            <Text style={styles.activityTitle}>
              🎥 Video promocional
            </Text>


            <Text style={styles.activityText}>
              Facebook • Ayer
            </Text>


            <Text style={styles.money}>
              Ganaste +$2.000
            </Text>


          </View>


        </>


      ) : (


        <View style={styles.companyCard}>


          <Text style={styles.companyTitle}>
            🏢 Portal Empresa
          </Text>


          <Text style={styles.companyText}>
            Gestiona campañas, creadores y publicaciones
          </Text>


        </View>


      )}



      <View style={{height:80}}/>


    </ScrollView>

  );

}



const styles = StyleSheet.create({


  container:{
    flex:1,
    backgroundColor:colors.background,
  },


  content:{
    paddingHorizontal:20,
    paddingTop:40,
  },


  switchContainer:{
    flexDirection:"row",
    backgroundColor:colors.surface,
    borderRadius:20,
    padding:5,
    marginBottom:20,
  },


  switchButton:{
    flex:1,
    paddingVertical:12,
    alignItems:"center",
    borderRadius:16,
  },


  activeButton:{
    backgroundColor:colors.primary,
  },


  switchText:{
    color:colors.white,
    fontWeight:"bold",
    fontSize:14,
  },


  activeText:{
    color:"#24103A",
  },


  statsContainer:{
    flexDirection:"row",
    justifyContent:"space-between",
    marginTop:20,
  },


  statCard:{
    width:"48%",
    backgroundColor:colors.card,
    borderRadius:18,
    padding:18,
    borderWidth:1,
    borderColor:colors.border,
  },


  statIcon:{
    fontSize:28,
  },


  statTitle:{
    color:colors.gray400,
    marginTop:10,
  },


  statValue:{
    color:colors.white,
    fontSize:22,
    fontWeight:"bold",
    marginTop:8,
  },


  sectionTitle:{
    color:colors.white,
    fontSize:20,
    fontWeight:"bold",
    marginTop:30,
    marginBottom:15,
  },


  card:{
    backgroundColor:colors.card,
    borderRadius:18,
    padding:18,
    borderWidth:1,
    borderColor:colors.border,
  },


  network:{
    color:colors.white,
    fontSize:16,
    marginBottom:10,
  },


  rank:{
    color:colors.primary,
    marginTop:10,
    fontWeight:"bold",
  },


  activityTitle:{
    color:colors.white,
    fontWeight:"bold",
    fontSize:16,
  },


  activityText:{
    color:colors.gray400,
    marginTop:6,
  },


  money:{
    color:colors.success,
    marginTop:8,
    fontWeight:"bold",
  },


  divider:{
    height:1,
    backgroundColor:colors.border,
    marginVertical:18,
  },


  companyCard:{
    backgroundColor:colors.card,
    borderRadius:20,
    padding:25,
    borderWidth:1,
    borderColor:colors.border,
  },


  companyTitle:{
    color:colors.white,
    fontSize:22,
    fontWeight:"bold",
  },


  companyText:{
    color:colors.gray400,
    marginTop:10,
    fontSize:15,
  },


});