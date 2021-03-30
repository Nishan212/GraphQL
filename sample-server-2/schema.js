const {
	GraphQLSchema,
	GraphQLObjectType,
	GraphQLList,
	GraphQLString,
	GraphQLInt,
	GraphQLNonNull,
} = require("graphql");
const axios = require("axios");

const URI = require("./creds.js");

console.log(URI);

const CustomerType = new GraphQLObjectType({
	name: "Customer",
	description: "Root Query",
	fields: () => ({
		id: { type: GraphQLNonNull(GraphQLString) },
		name: { type: GraphQLNonNull(GraphQLString) },
		email: { type: GraphQLString },
		age: { type: GraphQLInt },
	}),
});

const RootQuery = new GraphQLObjectType({
	name: "RootQueryType",
	fields: {
		customer: {
			type: CustomerType,
			description: "A single Customer",
			args: {
				id: { type: GraphQLString },
			},
			resolve: (parent, args) =>
				axios.get(`${URI}customers/${args.id}`).then((res) => res.data),
		},
		customers: {
			type: GraphQLList(CustomerType),
			description: "All the Customers",
			resolve: (parent, args) =>
				axios.get(`${URI}customers`).then((res) => res.data),
		},
	},
});

const mutation = new GraphQLObjectType({
	name: "Mutation",
	fields: {
		addCustomer: {
			type: CustomerType,
			description: "Add a Customer",
			args: {
				name: { type: new GraphQLNonNull(GraphQLString) },
				email: { type: new GraphQLNonNull(GraphQLString) },
				age: { type: new GraphQLNonNull(GraphQLInt) },
			},
			resolve(parent, args) {
				return axios
					.post(`${URI}customers`, {
						name: args.name,
						email: args.email,
						age: args.age,
					})
					.then((res) => res.data);
			},
		},
		deleteCustomer: {
			type: CustomerType,
			description: "Delete a Customer",
			args: {
				id: { type: new GraphQLNonNull(GraphQLString) },
			},
			resolve(parent, args) {
				return axios
					.delete(`${URI}customers/${args.id}`)
					.then((res) => res.data);
			},
		},
		editCustomer: {
			type: CustomerType,
			description: "Update / Edit a Customer",
			args: {
				id: { type: new GraphQLNonNull(GraphQLString) },
				name: { type: GraphQLString },
				email: { type: GraphQLString },
				age: { type: GraphQLInt },
			},
			resolve(parent, args) {
				return axios
					.patch(`${URI}customers/${args.id}`, args)
					.then((res) => res.data);
			},
		},
	},
});

module.exports = new GraphQLSchema({
	query: RootQuery,
	mutation: mutation,
});
