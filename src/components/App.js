import React, { Component } from 'react';
import Web3 from 'web3';
import Identicon from 'identicon.js';

import SocialNetwork from '../abis/SocialNetwork.json';
import Navbar from './Navbar';

import './App.css';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      account: '',
      socialNetwork: null,
      postCount: 0,
      posts: []
    };
  }
  async componentWillMount() {
    await this.loadWeb3();
    await this.loadBlockchainData()
  }

  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }
  }

  async loadBlockchainData() {
    const web3 = window.web3;
    // Load accounts
    const accounts = await web3.eth.getAccounts();
    this.setState({ account: accounts[0] })
    //Network ID
    const networkId = await web3.eth.net.getId()
    const networkData = SocialNetwork.networks[networkId]

    if(networkData) {
      const socialNetwork = web3.eth.Contract(SocialNetwork.abi, networkData.address)
      this.setState({ socialNetwork })

      const postCount = await socialNetwork.methods.postCount.call()
      this.setState({ postCount })

      // Load posts
      for(let i = 1; i <= postCount; i++) {
        const post = await socialNetwork.methods.posts[i].call()
        this.setState({
          posts: [...this.state.posts, post]
        })
      }
    } else {
      window.alert('SocialNetwork contract not deployed to detected network.')
    }
  }

  render() {
    return (
      <div>
        <Navbar account={this.state.account} />
        
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 mr-auto ml-auto" style={{ maxWidth: '500px'}}>
              <div className="content mr-auto ml-auto">
                { this.state.posts.map((post, key) => {
                  return (
                    <div className="card mb-4" style="width: 18rem;" key={key}>
                      <div className="card-header">
                        <img
                          className="ml-2"
                          width="30"
                          height="30"
                          src={`data:image/png;base64,${new Identicon(post.author, 30).toString()}`}
                        />
                        <small className="text-mute">{post.author}</small>
                      </div>
                      <ul className="list-group list-group-flush">
                        <li className="list-group-item">
                          <p>{post.content}</p>
                        </li>
                        <li className="list-group-item py-2">
                          <small className="float-left mt-1 text-muted">
                            TIPS: {window.web3.utils.fromWei(post.tipAmount.toString(), 'Ether')} ETH
                          </small>
                          <button className="btn btn-link btn-sm float-right pt-0">
                            TIP 0.1 ETH
                          </button>
                        </li>
                      </ul>
                    </div>
                  )
                })}
              </div>
            </main>
          </div>
        </div>

      </div>
    );
  }
}

export default App;
