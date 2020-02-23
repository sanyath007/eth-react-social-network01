import React from 'react';
import Identicon from 'identicon.js';

function Main(props) {
  return (
    <div className="container-fluid mt-5">
      <div className="row">
        <main role="main" className="col-lg-12 mr-auto ml-auto" style={{ maxWidth: '500px'}}>
          <div className="content mr-auto ml-auto">
            <p>&nbsp;</p>

            <form onSubmit={(event) => {
              event.preventDefault()
              const content = window.postContent.value
              props.createPost(content)
            }}>
              <div className="form-group mr-sm-2">
                <input
                  id="postContent"
                  type="text"
                  ref={input => window.postContent = input}
                  className="form-control"
                  placeholder="What's on your mind?"
                  required />
              </div>
              <button type="submit" className="btn btn-primary btn-block">Share</button>
            </form>
            <p>&nbsp;</p>

            { props.posts && props.posts.map((post, key) => {
              return (
                <div className="card mb-4" key={key}>
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
                      <button
                        className="btn btn-link btn-sm float-right pt-0"
                        onClick={e => {
                          let tipAmount = window.web3.utils.toWei('0.1', 'Ether')
                          props.tipPost(post.id.toString(), tipAmount)
                        }}
                      >
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
  );
}

export default Main;