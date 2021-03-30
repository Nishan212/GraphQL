const axios = require("axios");
const {
	GraphQLObjectType,
	GraphQLSchema,
	GraphQLInt,
	GraphQLString,
	GraphQLBoolean,
	GraphQLList,
} = require("graphql");
const URI = require("./creds");

const RocketType = new GraphQLObjectType({
	name: "Rocket",
	description: "Rocket Data",
	fields: () => ({
		rocket_id: { type: GraphQLString },
		rocket_name: { type: GraphQLString },
		rocket_type: { type: GraphQLString },
	}),
});

const LaunchType = new GraphQLObjectType({
	name: "Launch",
	description: "Launch Data",
	fields: () => ({
		flight_number: { type: GraphQLInt },
		mission_name: { type: GraphQLString },
		launch_year: { type: GraphQLString },
		launch_date_local: { type: GraphQLString },
		launch_success: { type: GraphQLBoolean },
		rocket: { type: RocketType },
	}),
});

const RootQuery = new GraphQLObjectType({
	name: "RootQueryType",
	description: "Root Query",
	fields: () => ({
		launches: {
			type: new GraphQLList(LaunchType),
			description: "List of Launches",
			resolve: (parent, args) =>
				axios.get(`${URI}/launches`).then((res) => res.data),
		},
		launch: {
			type: LaunchType,
			description: "A single Launch",
			args: {
				flight_number: { type: GraphQLInt },
			},
			resolve: (parent, args) =>
				axios
					.get(`${URI}launches/${args.flight_number}`)
					.then((res) => res.data),
		},
		rockets: {
			type: new GraphQLList(RocketType),
			description: "List of Rockets",
			resolve: (parent, args) =>
				axios.get(`${URI}rockets`).then((res) => res.data),
		},
		rocket: {
			type: RocketType,
			description: "A single Rocket",
			args: {
				id: { type: GraphQLString },
			},
			resolve: (parent, args) =>
				axios.get(`${URI}rockets/${args.id}`).then((res) => res.data),
		},
	}),
});

module.exports = new GraphQLSchema({
	query: RootQuery,
});
