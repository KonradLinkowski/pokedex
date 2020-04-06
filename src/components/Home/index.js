import React from "react";
import './styles.scss';
import axios from 'axios';
import Pokemon from '../Pokemon';

class  Home extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            pokemonsCount: 0,
            pokemons: [],
            currentPage: 0
        };
    }

    async onLoadPokemons() {
        const { count, results } = (await axios.get(`https://pokeapi.co/api/v2/pokemon?offset=${this.state.currentPage * 20}`)).data;
        const pokemons = (await Promise.all(results.map(result => axios.get(result.url)))).map(result => result.data);
        this.setState({
            pokemonsCount: count,
            pokemons
        });
    }

    onNextPage() {
        const totalPages = Math.ceil(this.state.pokemonsCount / 20);
        if (this.state.currentPage < totalPages) {
            this.setState({
                currentPage: this.state.currentPage + 1,
            }, () => {
                this.onLoadPokemons();
            });
            this.onCurrentPage();
        } else alert('There is no next page!');
    }

    onPrevPage() {
        if (this.state.currentPage > 0) {
            this.setState({
                currentPage: this.state.currentPage - 1,
            }, () => {
                this.onLoadPokemons();
            });
            this.onCurrentPage();
        } else alert('There is no previous page!');
    }

    onCurrentPage() {
        const totalPages = Math.ceil(this.state.pokemonsCount / 20);
        const restPages = [];
        for (let i = 0; i < totalPages; i++) {
            if (i - this.state.currentPage < 5 && this.state.currentPage - i < 5){
            restPages.push(<a
                href='#'
                onClick={() => {
                    this.setState({
                        currentPage: i,
                    }, () => {
                        this.onLoadPokemons();
                    });
                }}
                id={i}
                // eslint-disable-next-line react/no-direct-mutation-state
                className={this.state.currentPage === i ?
                    'singlePage active' :
                    'singlePage'}>{i+1}</a>);
            }
        }
        return restPages;
    }

    componentDidMount() {
        this.onLoadPokemons();
    }

    render() {
        const pokemons = this.state.pokemons;
        return (
            <div className='mainContainer'>
                <div className='info'>
                    <p className='results'>Pokemons found: {this.state.pokemonsCount}</p>
                    <div className='filters'>
                        <i className="fas fa-filter" />
                        <p className='filtersText'>Filters</p>
                    </div>
                </div>
                <div className="header">
                    <p className='name'>Name</p>
                    <p>Prop 1</p>
                    <p>Prop 2</p>
                    <p>Prop 3</p>
                    <p>Prop 4</p>
                </div>
                {pokemons.map((pokemon) =>
                    <Pokemon key={pokemon.id} pokemon={pokemon} />
                )}
                <div className="pagination">
                    <button onClick={() => this.onPrevPage()}>Prev</button>
                    {this.onCurrentPage()}
                    <button onClick={() => this.onNextPage()}>Next</button>
                </div>
            </div>
        )
    }
}

export default Home;