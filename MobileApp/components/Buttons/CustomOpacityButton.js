import React from "react";
import { View, TouchableOpacity, Text } from "react-native";

export default TouchableBtn = ({ viewStyle, touchableOpacStyle, onPress, Title, titleStyle, borderRadius }) => {
  const buttonStyle = {
    borderRadius: borderRadius || 5,
  };

  return (
    <View style={viewStyle}>
      <TouchableOpacity style={buttonStyle} onPress={onPress}>
        <Text style={titleStyle}>{Title}</Text>
      </TouchableOpacity>
    </View>
  );
};

const customFontStyle = {
    fontFamily: 'Didot-Bold', 
  };
