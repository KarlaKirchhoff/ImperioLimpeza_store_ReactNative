import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    Alert,
    Dimensions,
} from 'react-native';

// Número de colunas na grid
const NUM_COLUMNS = 4;

// Largura da tela
const SCREEN_WIDTH = Dimensions.get('window').width;

// Tamanho do quadrado
const SQUARE_SIZE = SCREEN_WIDTH / NUM_COLUMNS - 20;

function gerarLista(vagas) {

    let listaVagas = []
    let count = 0
    while (count < vagas.qtd) {
        const vaga = `${vagas.nome}${count + 1}`
        const disponivel = true
        const item = { id: `${vaga}`, nome: `${vaga}`, status: disponivel, label: `${vaga} - ${disponivel ? 'Disponível' : 'Reservado'}` }
        listaVagas.push(item)
        count++
    }
    return listaVagas
}

const SquareList = ({ vagas }) => {
    const listaVagas = gerarLista(vagas);

    const [lista, setLista] = useState(listaVagas)

    function atualizarVaga(itemId) {
        setLista((prevLista) =>
            prevLista.map((item) => {
                if (item.id === itemId) {
                    const novoDisponivel = !item.status;
                    return {
                        ...item,
                        status: novoDisponivel,
                        label: `${item.id} - ${novoDisponivel ? 'Disponível' : 'Reservado'}`,
                    };
                }
                return item;
            })
        );
    }

    const handlePress = (vaga) => {
        if (vaga.status) {
            // Vaga está disponível → deseja reservar?
            Alert.alert(
                'Deseja reservar?',
                `Você está reservando a vaga ${vaga.id}`,
                [
                    {
                        text: 'Cancelar',
                        style: 'cancel',
                    },
                    {
                        text: 'Confirmar',
                        onPress: () => atualizarVaga(vaga.id),
                    },
                ],
                { cancelable: true }
            );
        } else {
            // Vaga já está reservada → deseja cancelar?
            Alert.alert(
                'Deseja cancelar?',
                `Você está cancelando a reserva da vaga ${vaga.id}`,
                [
                    {
                        text: 'Cancelar',
                        style: 'cancel',
                    },
                    {
                        text: 'Confirmar',
                        onPress: () => atualizarVaga(vaga.id),
                    },
                ],
                { cancelable: true }
            );
        }
    };


    const renderItem = ({ item }) => {

        const disponivel = item.status

        return (
            <TouchableOpacity
                style={[styles.vaga, disponivel ? styles.vagaTrue : styles.vagaFalse]}
                onPress={() => handlePress(item)}
            >
                <Text style={styles.squareText}>{item.nome}</Text>
            </TouchableOpacity>
        )
    };

    return (
        <FlatList
            data={lista}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            numColumns={NUM_COLUMNS}
            contentContainerStyle={styles.container}
        />
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 60,
        padding: 10
    },
    vaga: {
        width: SQUARE_SIZE,
        height: SQUARE_SIZE,
        margin: 5,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
    },
    vagaTrue: {
        backgroundColor: '#35ad49ff',
    },
    vagaFalse: {
        backgroundColor: '#d42e2eff',
    },
    squareText: {
        color: '#fff',
        fontWeight: 'bold',
        textAlign: 'center',
    },
});

export default SquareList;
