const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Reduzir imports de ícones
config.resolver.alias = {
  '@expo/vector-icons': '@expo/vector-icons/Ionicons',
};

// Excluir arquivos desnecessários
config.resolver.blockList = [
  /.*\.md$/,
  /.*\.test\.(js|jsx|ts|tsx)$/,
  /.*\.spec\.(js|jsx|ts|tsx)$/,
  /.*\/__tests__\/.*/,
];

// Adicionar extensões SVG
config.transformer.babelTransformerPath = require.resolve('react-native-svg-transformer');
config.resolver.assetExts = config.resolver.assetExts.filter(ext => ext !== 'svg');
config.resolver.sourceExts = [...config.resolver.sourceExts, 'svg'];

module.exports = config;
