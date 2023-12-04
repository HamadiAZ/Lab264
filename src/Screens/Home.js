import React, { useState } from "react";
import { View, Text ,Modal,StyleSheet,Pressable, Alert,TouchableOpacity} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useSelector, useDispatch } from "react-redux";

import Card from "../Components/Card";
import ConnectionStatusBar from "../Components/ConnectionStatusBar";


function FirstLevelScreen() {
  const navigation = useNavigation();
  const reduxData = useSelector((state) => state.data);


  const [modalVisible, setModalVisible] = useState(false);

  function handleCloseModal(){
    //Alert.alert('Modal has been closed.');
    setModalVisible(false);
  }

  function handleOpenModal(){
    //Alert.alert('Modal has been closed.');
    setModalVisible(true);
  }

  function toggleSettings(card){
    console.log(card)
    setModalVisible(true);
  }


  return (
    <View className="flex-1 bg-white">
      <ConnectionStatusBar />
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={handleCloseModal}>
        <TouchableOpacity className="flex justify-end align-middle h-full pb-4 " onPress={handleCloseModal}>
          <TouchableOpacity className="flex items-center align-middle bg-red-500" onPress={console.log("test")}>
            <Text >Hello World!</Text>
            <Text style={styles.modalText}>Hello World!</Text>
            <Text style={styles.modalText}>Hello World!</Text>
            

            <Pressable
            className="border-2 p-6 bg-stone-700 w-11/12 "
              onPress={() => setModalVisible(false)}>
              <Text style={styles.textStyle}>Hide Modal</Text>
            </Pressable>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
      {reduxData.Data.map((card, index) => {
        return (
          <Card
            key={index}
            name={card.name}
            path={card.path}
            separator={card.separator}
            Data={card.Data}
            card={card}
            navigation={navigation}
            toggleSettings={toggleSettings}
          />
        );
      })}
    </View>
  );
}

export default FirstLevelScreen;

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
