import { useNavigation } from "@react-navigation/native";
import React, { useEffect } from "react";
import { Text, TouchableOpacity } from "react-native";
import Card from "../Components/Card";

import { useState } from "react";
import { Modal, Pressable } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { useSelector } from "react-redux";
import ConnectionStatusBar from "../Components/ConnectionStatusBar";
import CustomItem from "../Components/items/CustomItem";
import OpenCloseItem from "../Components/items/OpenCloseItem";
import SliderItem from "../Components/items/SliderItem";

function ListCards({ route }) {
  const name = route?.params?.name;
  const [modalVisible, setModalVisible] = useState(false);

  const navigation = useNavigation();
  const reduxData = useSelector((state) => state.data);
  let list = route?.params?.Data;
  list = list == undefined ? reduxData.Data : list;

  function handleCloseModal() {
    //Alert.alert('Modal has been closed.');
    setModalVisible(false);
  }

  function handleOpenModal() {
    //Alert.alert('Modal has been closed.');
    setModalVisible(true);
  }

  function toggleSettings(card) {
    console.log(card);
    setModalVisible(true);
  }

  useEffect(() => {
    navigation.setOptions({
      title: name != undefined ? name : "Home", // Set the new title for the navigation bar
    });
  });

  return (
    <ScrollView className="bg-white">
      <ConnectionStatusBar />
      <Modal animationType="slide" transparent={true} visible={modalVisible} onRequestClose={handleCloseModal}>
        <TouchableOpacity className="flex justify-end align-middle h-full pb-4 " onPress={handleCloseModal}>
          <TouchableOpacity className="flex items-center align-middle bg-red-500" onPress={()=>console.log("test modal")}>
            <Text>Hello World!</Text>
            <Text>Hello World!</Text>
            <Text>Hello World!</Text>
            <Pressable className="border-2 p-6 bg-stone-700 w-11/12 " onPress={() => setModalVisible(false)}>
              <Text>Hide Modal</Text>
            </Pressable>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
      {list?.map((card, index) => {
        if (card.type == "container") return <Card key={index} name={card.name} path={card.cumulativePath} Data={card.Data} card={card} separator={card.separator} showSetting={!card.redirect} toggleSettings={toggleSettings} redirect={card.redirect} />;
        if (card.type == "Slider") return <SliderItem key={index} name={card.name} path={card.cumulativePath} Data={card} />;
        if (card.type == "Button" || card.type == "Switch") return <OpenCloseItem key={index} name={card.name} path={card.cumulativePath} Data={card} />;
        return <CustomItem key={index} name={card.name} path={card.cumulativePath} Data={card} />;
      })}
    </ScrollView>
  );
}

export default ListCards;
