# multi-layer-map-api

[![Build Status](https://travis-ci.org/Artsdatabanken/multi-layer-map-api.svg?branch=master)](https://travis-ci.org/Artsdatabanken/multi-layer-map-api)
[![Coverage Status](https://coveralls.io/repos/github/Artsdatabanken/multi-layer-map-api/badge.svg?branch=master)](https://coveralls.io/github/Artsdatabanken/multi-layer-map-api?branch=master)
[![Open Source Love](https://badges.frapsoft.com/os/v2/open-source.svg?v=103)](https://github.com/ellerbrock/open-source-badges/)
[![MIT Licence](https://badges.frapsoft.com/os/mit/mit.svg?v=103)](https://opensource.org/licenses/mit-license.php)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md#pull-requests)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)

Demo: [multi-layer-map-api](https://multilag.artsdatabanken.no)

multi-layer-map-api merges multiple map layers into single raster.

## Upstream formats

- Raster tiles .mbtiles files (x,y,z)

## Installation

Put one or more .mbtiles inside the data subfolder.

Execute:

```
npm install
npm run start
```

Navigate to http://localhost:8000/ to display a summary of the tile sets.

Tiles can be pulled using an url of this form: http://localhost:8000/{z}/{x}/{y}?l1=Naturvernområde&l2=Biota

## Configuration

multi-layer-map-api has command-line options:

```
Usage: node multi-layer-map-api.js [options] [rootDirectory]

rootDirectory    Data directory containing .mbtiles

Options:
   -p PORT --port PORT       Set the HTTP port [8000]

A root directory is required.
```

## Images

The following images are built for each multi-layer-map-api release, using the Node.js base image.

- Latest: https://hub.docker.com/r/artsdatabanken/multi-layer-map-api/

### Docker image

To use prebuilt docker image, navigate to a folder containing .mbtile file(s) and run

```
docker run -v ${pwd}:/data -p 8000:8000 artsdatabanken/multi-layer-map-api
```
