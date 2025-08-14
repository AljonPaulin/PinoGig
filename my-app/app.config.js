import 'dotenv/config';

export default {
  expo: {
    name: "Pinogig",
    slug: "my-app",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/logoPinogig.png",
    scheme: "myapp",
    userInterfaceStyle: "automatic",
    newArchEnabled: true,

    ios: {
      supportsTablet: true,
    },

    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/images/logoPinogig.png",
        backgroundColor: "#000e1a",
      },
      edgeToEdgeEnabled: true,
      package: "com.anonymous.myapp"
    },

    web: {
      bundler: "metro",
      output: "static",
      favicon: "./assets/images/favicon.png",
    },

    plugins: [
      "expo-router",
      [
        "expo-splash-screen",
        {
          image: "./assets/images/splash-icon.png",
          imageWidth: 200,
          resizeMode: "contain",
          backgroundColor: "#ffffff",
        },
      ],
    ],

    experiments: {
      typedRoutes: true,
    },

    extra: {
      SUPABASEURL: process.env.SUPABASEURL,
      SUPABASEKEY: process.env.SUPABASEKEY,
      eas: {
        "projectId": "e7b66b07-9269-476f-8bdb-a489947e55d3"
      }
    },
  },
};
