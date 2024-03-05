import React, { useRef, useState, useEffect, useContext } from "react";
import { Camera } from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import styled from "styled-components/native";
import { View, TouchableOpacity, Button, Image } from "react-native";
import { Text } from "../styles/text.styles";
import { AuthenticationContextRider } from "../context/authenticationRider.context";
import { storage } from "../service/firebase.service";
import {
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
import { updateAndFetchRiderPicture } from "../service/firestore.service";
import { db } from "../service/firebase.service";
import { doc, onSnapshot } from "firebase/firestore";
import { Spacer } from "../styles/spacer.styles";

const ProfileCamera = styled(Camera)`
  flex: 1;
`;

const CameraButton = styled.View`
  flex: 1;
  background-color: transparent;
  flex-direction: row;
  margin: 20px;
  justify-content: center;
  align-items: flex-end;
`;

export const CameraScreenRider = ({ navigation }) => {
  const [hasPermission, setHasPermission] = useState(null);
  const cameraRef = useRef();
  const { rider, profilePicUrlRider, setProfilePicUrlRider } = useContext(
    AuthenticationContextRider
  );

  const snap = async () => {
    if (cameraRef) {
      const photo = await cameraRef.current.takePictureAsync();
      const response = await fetch(photo.uri);
      const blob = await response.blob();
      const ref = storageRef(
        storage,
        `profile_pictures/riders/${rider.phoneNumberRider}`
      );

      uploadBytes(ref, blob)
        .then(async (snapshot) => {
          const downloadURL = await getDownloadURL(ref);
          console.log("File available at", downloadURL);
          await updateAndFetchRiderPicture(rider.phoneNumberRider, downloadURL);
          setProfilePicUrlRider(downloadURL);
          navigation.goBack();
        })
        .catch((error) => {
          console.error("Error with Firebase Storage:", error);
        });
    }
  };
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const { uri } = result.assets[0];
      try {
        const response = await fetch(uri);
        const blob = await response.blob();
        const ref = storageRef(
          storage,
          `profile_pictures/riders/${rider.phoneNumberRider}`
        );

        await uploadBytes(ref, blob);
        const downloadURL = await getDownloadURL(ref);
        console.log("File available at", downloadURL);

        await updateAndFetchRiderPicture(rider.phoneNumberRider, downloadURL);
        setProfilePicUrlRider(downloadURL);
        navigation.goBack();
      } catch (error) {
        console.error("Error with picking image and uploading:", error);
      }
    }
  };

  useEffect(() => {
    if (!rider || !rider.phoneNumberRider) {
      console.error("Rider or Rider Phone is undefined.");
      return;
    }
    const userDocRef = doc(db, "riders", rider.phoneNumberRider);
    const unsubscribe = onSnapshot(riderDocRef, (docSnapshot) => {
      if (docSnapshot.exists) {
        const riderData = docSnapshot.data();
        if (riderData.profilePictureRider !== profilePicUrlRider) {
          setProfilePicUrlRider(riderData.profilePictureRider);
        }
      }
    });
    return () => {
      unsubscribe();
    };
  }, [profilePicUrlRider]);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }
  return (
    <ProfileCamera
      ref={(camera) => (cameraRef.current = camera)}
      type={Camera.Constants.Type.front}
    >
      <CameraButton>
        <TouchableOpacity
          style={{
            borderWidth: 2,
            borderRadius: 50,
            borderColor: "white",
            height: 50,
            width: 50,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
          onPress={snap}
        >
          <View
            style={{
              borderWidth: 2,
              borderRadius: 50,
              borderColor: "white",
              height: 40,
              width: 40,
              backgroundColor: "white",
            }}
          ></View>
        </TouchableOpacity>
      </CameraButton>
      <Button
        mode="contained"
        title="Pick an image from gallery"
        onPress={pickImage}
      />
      <Spacer />
    </ProfileCamera>
  );
};
