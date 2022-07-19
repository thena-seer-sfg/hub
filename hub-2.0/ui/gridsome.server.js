// Server API makes it possible to hook into various parts of Gridsome
// on server-side and add custom data to the GraphQL data layer.
// Learn more: https://gridsome.org/docs/server-api/

// Changes here require a server restart.
// To restart press CTRL + C in terminal and run `gridsome develop`

const fs = require("fs");
const yaml = require("js-yaml");
const path = require("path");

const dataRoot = "../../_data/";

const defaultVariants = yaml.load(
  fs.readFileSync(path.join(dataRoot, "default_variants.yml"))
);

const readMaintainers = yaml.load(
  fs.readFileSync(path.join(dataRoot, "maintainers.yml"))
);

function buildData(dataPath, collection) {
  const currentCollection = dataPath;
  let collectionFolder = fs.readdirSync(dataPath);
  collectionFolder = collectionFolder.filter(
    item => !/(^|\/)\.[^/.]/g.test(item)
  );
  collectionFolder.forEach(folder => {
    const currentFolder = folder;
    const subfolderPlugins = fs.readdirSync(`${currentCollection}/${folder}`);
    subfolderPlugins.forEach(plugin => {
      const fileContents = fs.readFileSync(
        `${currentCollection}/${currentFolder}/${plugin}`
      );
      const readPlugin = yaml.load(fileContents);
      readPlugin.isDefault =
        defaultVariants[path.basename(dataPath)][currentFolder] ===
        readPlugin.variant;
      readPlugin.pluginType = path.basename(dataPath).slice(0, -1);
      collection.addNode(readPlugin);
    });
  });
}

function buildMaintainers(collection) {
  // key value
  //       key value, value

  for (const [key, value] of Object.entries(collection)) {
    // console.log(`${key}: ${value}`);
    // console.log(Object.values(value));
    const val = Object.values(value);
    const ent = Object.values(value);
    console.log(ent);
    // console.log(`${key}: ${val}`);
    const arr = [key, val[0], val[1]];
    // console.log(arr);
    // console.log(`${key}: ${val[0]}, ${val[1]}`);
    // for (const [k, v] of Object.entries(value)) {
    //   console.log(`${key}: ${k} - ${v}`);
    // }
  }
}

buildMaintainers(readMaintainers);

module.exports = function main(api) {
  api.loadSource(async actions => {
    const extractorsCollection = actions.addCollection({
      typeName: "Extractors"
    });
    const loadersCollection = actions.addCollection({
      typeName: "Loaders"
    });
    const filesCollection = actions.addCollection({
      typeName: "Files"
    });
    const orchestratorsCollection = actions.addCollection({
      typeName: "Orchestrators"
    });
    const transformersCollection = actions.addCollection({
      typeName: "Transformers"
    });
    const utilitiesCollection = actions.addCollection({
      typeName: "Utilities"
    });
    const maintainersCollection = actions.addCollection({
      typeName: "Maintainers"
    });

    buildData(path.join(dataRoot, "meltano/extractors"), extractorsCollection);
    buildData(path.join(dataRoot, "meltano/loaders"), loadersCollection);
    buildData(path.join(dataRoot, "meltano/files"), filesCollection);
    buildData(
      path.join(dataRoot, "meltano/orchestrators"),
      orchestratorsCollection
    );
    buildData(
      path.join(dataRoot, "meltano/transformers"),
      transformersCollection
    );
    buildData(path.join(dataRoot, "meltano/utilities"), utilitiesCollection);
  });
};
