import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { router } from "expo-router";

export default function WelcomeScreen() {
  return (
    <View style={styles.container}>

      <View style={styles.logoContainer}>
        <Text style={styles.logo}>
          Publi<Text style={styles.logoAccent}>Gana</Text>
        </Text>

        <Text style={styles.subtitle}>
          Conecta negocios con personas{"\n"}
          y gana promocionando
        </Text>
      </View>


      <View style={styles.content}>

        <Text style={styles.title}>
          Bienvenido
        </Text>

        <Text style={styles.description}>
          ¿Cómo quieres usar Publigana?
        </Text>


        <TouchableOpacity
          style={styles.card}
          onPress={() =>
            router.push("/auth/register?rol=promotor")
          }
        >
          <Text style={styles.icon}>
            👤
          </Text>

          <View>
            <Text style={styles.cardTitle}>
              Promotor / Influencer
            </Text>

            <Text style={styles.cardText}>
              Comparte campañas y genera ingresos
            </Text>
          </View>

        </TouchableOpacity>



        <TouchableOpacity
          style={styles.card}
          onPress={() =>
            router.push("/auth/register?rol=empresa")
          }
        >
          <Text style={styles.icon}>
            🏢
          </Text>

          <View>
            <Text style={styles.cardTitle}>
              Empresa
            </Text>

            <Text style={styles.cardText}>
              Crea campañas y encuentra talento
            </Text>
          </View>

        </TouchableOpacity>


      </View>


      <TouchableOpacity
        style={styles.loginButton}
        onPress={() => router.push("/auth/login")}
      >
        <Text style={styles.loginText}>
          Iniciar sesión
        </Text>
      </TouchableOpacity>


    </View>
  );
}



const styles = StyleSheet.create({

  container:{
    flex:1,
    backgroundColor:"#100021",
    padding:24,
    justifyContent:"space-between",
  },


  logoContainer:{
    marginTop:80,
    alignItems:"center",
  },


  logo:{
    fontSize:42,
    fontWeight:"900",
    color:"#FFFFFF",
  },


  logoAccent:{
    color:"#FFB020",
  },


  subtitle:{
    marginTop:15,
    color:"#B8A9D9",
    textAlign:"center",
    fontSize:16,
    lineHeight:24,
  },


  content:{
    gap:18,
  },


  title:{
    color:"#FFFFFF",
    fontSize:32,
    fontWeight:"800",
    textAlign:"center",
  },


  description:{
    color:"#B8A9D9",
    textAlign:"center",
    marginBottom:15,
  },


  card:{
    flexDirection:"row",
    alignItems:"center",
    backgroundColor:"#24104A",
    borderRadius:20,
    padding:20,
    borderWidth:1,
    borderColor:"#4B238A",
  },


  icon:{
    fontSize:38,
    marginRight:15,
  },


  cardTitle:{
    color:"#FFFFFF",
    fontSize:20,
    fontWeight:"700",
  },


  cardText:{
    color:"#B8A9D9",
    marginTop:5,
  },


  loginButton:{
    backgroundColor:"#8B3DFF",
    padding:18,
    borderRadius:18,
    alignItems:"center",
    marginBottom:35,
  },


  loginText:{
    color:"#FFFFFF",
    fontSize:18,
    fontWeight:"800",
  }

});