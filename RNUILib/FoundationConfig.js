import { Colors, Typography, Spacings } from "react-native-ui-lib";

export default function loadFoundationConfig() {
  Colors.loadColors({
    primaryColor: "#ffffff",
    secondaryColor: "#FAA353",
    greyBackgroundColor: "#cbcbcb23",
    textColor: "##221D23",
    errorColor: "#E63B2E",
    successColor: "#ADC76F",
    warnColor: "##FF963C",
  });

  Typography.loadTypographies({
    heading: { fontSize: 36, fontWeight: "600" },
    subheading: { fontSize: 28, fontWeight: "500" },
    body: { fontSize: 18, fontWeight: "400" },
  });

  Spacings.loadSpacings({
    page: 20,
    card: 12,
    gridGutter: 16,
  });
}
