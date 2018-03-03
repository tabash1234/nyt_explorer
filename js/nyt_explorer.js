class App extends React.Component {

            constructor(props){
                super(props);
				
                this.state = {
                    data: [],
                    selectedArticle: {
						id: 'article ID',
						headline: 'Browse through New York Times archives',
                        snippet: 'See short clip from the article, along with more data such as:',
                        word_count: 'number of words used',
                        pub_date: 'publication data and time',
                        web_url: 'and direct link to the page'
                    },
					year: '',
					month: '',
                };
				
                this.setData = this.setData.bind(this);
                this.handleArticleClick = this.handleArticleClick.bind(this);
				this.setYearAndMonth = this.setYearAndMonth.bind(this);
                this.refresh = this.refresh.bind(this);
            }

            handleArticleClick(item){
                this.setState({selectedArticle: item});
            }
			
			setYearAndMonth(y,m) {
			if (y<1851||y>2018||m<1||m>12){
			alert('These numbers seem wrong');
			return}
			     this.setState({year: y,month: m});
                 this.refresh();
			}
			
			
            setData(requestedData){
				let article = [];
				for(var i = 0; i <8; i++) {
				const doc = requestedData.response.docs[i];
				article.push(doc);
				}
				console.log(requestedData);
                this.setState({data: article});
				
			
				
            }

            refresh(){
                if(!this.state.year || !this.state.month) {
                    return;
                }
                $.ajax({
                  url: 'https://api.nytimes.com/svc/archive/v1/' +  this.state.year + "/" + this.state.month + ".json",
                  method: 'GET',
                  data: {
                      'api-key': "2ad417c011a6487eb5483e0b98c4d096"
                  },
                  success: this.setData
                });
            }

            render(){
                return (
                    <div className="page">
					
					
                        <div className="master">
                            <ArticleResults 
                                selectionHandler={this.handleArticleClick} 
                                data={this.state.data}
								
								/>
                        </div>
                        <div className="details">
                            <ArticleDetails
                                artc={this.state.selectedArticle}/>
                        </div>
                    </div>
                );
            }

        }

        const ArticleDetails = (props) => {
            const artc = props.artc;
			
			
            return (
                <div className = 'sidebar'>
                    
						<h1>{artc.headline.main}</h1>
                        <li>ID: {artc._id}</li>

                        
                        <p>Preview: {artc.snippet}</p>
						
						
                        <li>Published: {artc.pub_date.substr(0, 10)}</li>
						<li>Word count: {artc.word_count}</li>
						<br/>
                        <a href={artc.web_url} target="_blank"> Read the whole article!</a>
                    
                </div>
            );
        }

        class Article extends React.Component{
             
            constructor(props){
            super(props);
            this.state = {
                 title: '',
                 description: '',
                 image: '',
                 url: '',
				 checkurl: ''
             };
           
             this.onSuccess = this.onSuccess.bind(this);
			 this.restart = this.restart.bind(this);
       }
           
            onSuccess(responseData){
               console.log(responseData);
               let title = responseData.title;
               let description = responseData.description;
               let image = responseData.image;
               this.setState({
                   'title': title, 
                   'description': description, 
                   'image': image, 
				   'checkurl':this.props.item.web_url
               });
               
           }
		   
 
		restart(){
        //const apiKey = '5a9a921e870c208dd1c0e421f593154ed4f4f0a379f92';
		const url = 'https://api.linkpreview.net/?key=123456&q=https://www.google.com';
        //const url = `https://api.linkpreview.net/?key=${apiKey}&q=${this.props.item.web_url}`;
        $.ajax({
          url,
          success: this.onSuccess
        });
       }  


		componentDidMount(){
         this.restart(); 
       } 

		   
		componentDidUpdate(){  
		if (this.state.checkurl == this.props.item.web_url){return}
		this.restart();  
		}
	  
            render(){
                const artBlock = this.props.item;
                const clickHandler = this.props.clickHandler;
                const block =
                    <div className='card' onClick={() => clickHandler(artBlock)}>
                     <div className= 'artTitle'>{this.state.title}</div>
					 <img src={this.state.image} className = 'picture'/>
                     <div className= 'description'>{this.state.description}</div>
                    </div>;
                return block;
            }
        }

        class ArticleResults extends React.Component {

            render() {
                const articles = this.props.data;

                const tableResults =
                    <div className='previews'>
                            {
                                articles.map(
                                    (artc, index) => <Article
                                        key={index}
                                        item={artc}
                                        clickHandler={this.props.selectionHandler} />
                                )
                            }
                    </div>;
                 return tableResults;
            }
        }
		
		var app;

        function find(){
            const root = document.getElementById('root');
            if(!app){
                app = ReactDOM.render(<App />,  root);    
            }
            var y = document.getElementById('year').value;
            var m = document.getElementById('month').value;
            app.setYearAndMonth(y, m);
        }
