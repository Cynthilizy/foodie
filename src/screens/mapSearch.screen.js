import React, { useContext, useState, useEffect } from "react";
import styled from "styled-components/native";
import { Searchbar } from "react-native-paper";

const Searching = styled.View`
  padding: ${(props) => props.theme.space[3]};
  position: absolute;
  z-index: 999;
  top: 50px;
  width: 100%;
`;

export const SearchMap = () => {
  const [searchKeyword, setSearchKeyword] = useState("search for address");
  /* useEffect(() => {
    setSearchKeyword("test");
  }, [keyword]);*/
  return (
    <Searching>
      <Searchbar
        placeholder="Search by address"
        icon={"map"}
        value={searchKeyword}
        onSubmitEditing={() => {
          null;
        }}
        onChangeText={(text) => {
          setSearchKeyword(text);
        }}
      />
    </Searching>
  );
};
