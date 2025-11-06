import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Linking,
  ScrollView,
  Image,
  Alert,
} from "react-native";
import * as Location from "expo-location";

export default function SobreNos_Screen() {
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

  const empresa = {
    nome: "Império da Limpeza",
    telefone: "+55 11 3456-7890",
    whatsapp: "+55 11 91234-5678",
    email: "contato@cleanpro.com.br",
    endereco: "Rua das Flores, 123 - São Paulo, SP",
    latitude: -23.55052,
    longitude: -46.633308,
    facebook: "https://facebook.com/cleanprobr",
    instagram: "https://instagram.com/cleanprobr",
    descricao:
      "A CleanPro é uma empresa especializada em produtos de limpeza de alta qualidade. Nosso compromisso é oferecer soluções eficazes e sustentáveis para residências e empresas em todo o Brasil.",
    galeria: [
      "https://images.unsplash.com/photo-1600172454284-9347a91d7052",
      "https://images.unsplash.com/photo-1600423115369-592b0b5b6d5e",
      "https://images.unsplash.com/photo-1599058917212-d750089bc07b",
    ],
  };

  // Solicita permissão e obtém localização atual
  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permissão negada", "Não foi possível acessar a localização.");
        return;
      }
      const location = await Location.getCurrentPositionAsync({});
      setUserLocation({
        lat: location.coords.latitude,
        lng: location.coords.longitude,
      });
    })();
  }, []);

  // Abre o Google Maps com a rota até a empresa
  const abrirRota = () => {
    if (!userLocation) {
      Alert.alert("Aguarde", "Obtendo localização atual...");
      return;
    }
    const url = `https://www.google.com/maps/dir/?api=1&origin=${userLocation.lat},${userLocation.lng}&destination=${empresa.latitude},${empresa.longitude}`;
    Linking.openURL(url);
  };

  const abrirLink = (url: string) => {
    Linking.openURL(url).catch(() => Alert.alert("Erro", "Não foi possível abrir o link."));
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.nomeEmpresa}>{empresa.nome}</Text>

      <View style={styles.section}>
        <Text style={styles.titulo}>📞 Contato</Text>
        <TouchableOpacity onPress={() => abrirLink(`tel:${empresa.telefone}`)}>
          <Text style={styles.link}>Telefone: {empresa.telefone}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => abrirLink(`https://wa.me/${empresa.whatsapp.replace(/\D/g, "")}`)}>
          <Text style={styles.link}>WhatsApp: {empresa.whatsapp}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => abrirLink(`mailto:${empresa.email}`)}>
          <Text style={styles.link}>Email: {empresa.email}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.titulo}>🌐 Redes Sociais</Text>
        <TouchableOpacity onPress={() => abrirLink(empresa.facebook)}>
          <Text style={styles.link}>Facebook</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => abrirLink(empresa.instagram)}>
          <Text style={styles.link}>Instagram</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.titulo}>📍 Endereço</Text>
        <TouchableOpacity onPress={abrirRota}>
          <Text style={[styles.link, { color: "#2E7D32" }]}>{empresa.endereco}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.titulo}>🏢 Sobre a Empresa</Text>
        <Text style={styles.descricao}>{empresa.descricao}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.titulo}>🖼️ Nossa Galeria</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {empresa.galeria.map((url, index) => (
            <Image key={index} source={{ uri: url }} style={styles.imagem} />
          ))}
        </ScrollView>
      </View>
    </ScrollView>
  );
}

// -------------------- ESTILOS --------------------
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAFAFA",
    padding: 20,
  },
  nomeEmpresa: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  section: {
    marginBottom: 20,
  },
  titulo: {
    fontSize: 18,
    fontWeight: "600",
    color: "#444",
    marginBottom: 6,
  },
  link: {
    fontSize: 16,
    color: "#0277BD",
    marginBottom: 4,
  },
  descricao: {
    fontSize: 15,
    color: "#555",
    lineHeight: 20,
  },
  imagem: {
    width: 180,
    height: 120,
    borderRadius: 10,
    marginRight: 10,
  },
});
