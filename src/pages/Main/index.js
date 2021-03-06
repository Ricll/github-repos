import React, { Component } from "react";
import { Link } from "react-router-dom";
import { FaGithubAlt, FaPlus, FaSpinner } from "react-icons/fa";
import api from "../../services/api";

import { Container, Form, SubmitButton, List } from "./styles";

export default class Main extends Component {
    constructor() {
        super();
        this.state = {
            newRepo: "",
            repositories: [],
            loading: false
        };
    }

    componentDidMount() {
        const repositories = localStorage.getItem("repositories");

        if (repositories) {
            this.setState({ repositories: JSON.parse(repositories) });
        }
    }

    componentDidUpdate(_, prevState) {
        const { repositories } = this.state;

        if (prevState.repositories !== repositories) {
            localStorage.setItem("repositories", JSON.stringify(repositories));
        }
    }

    handleSubmit = async e => {
        e.preventDefault();
        this.setState({ loading: true });
        const { newRepo } = this.state;
        const { repositories } = this.state;

        const response = await api.get(`/repos/${newRepo}`);

        const data = {
            name: response.data.full_name
        };

        this.setState({
            repositories: [...repositories, data],
            newRepo: "",
            loading: false
        });
    };

    handleInputChange = e => {
        this.setState({ newRepo: e.target.value });
    };

    // FaSpinner = Condicional Render
    render() {
        const { newRepo, loading, repositories } = this.state;
        return (
            <Container>
                <h1>
                    <FaGithubAlt />
                    Repositórios
                </h1>
                <Form onSubmit={this.handleSubmit}>
                    <input
                        type="text"
                        placeholder="Adicionar repositório"
                        value={newRepo}
                        onChange={this.handleInputChange}
                    />
                    <SubmitButton loading={loading}>
                        {loading ? (
                            <FaSpinner color="#FFF" size={14} />
                        ) : (
                            <FaPlus color="#FFF" size={14} />
                        )}
                    </SubmitButton>
                </Form>
                <List>
                    {repositories.map(repository => (
                        <li key={repository.name}>
                            <span>{repository.name}</span>
                            <Link
                                to={`/respository/${encodeURIComponent(
                                    repository.name
                                )}`}
                            >
                                Detalhes
                            </Link>
                        </li>
                    ))}
                </List>
            </Container>
        );
    }
}
