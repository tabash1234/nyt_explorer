//Main component that renders two components ArticleResults and ArticleDetails
class App extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			data: [],
			selectedArticle: {
				id: '',
				headline: '',
				snippet: 'Browse through New York Times archives',
				word_count: '',
				pub_date: '',
				web_url: ''
			},
			year: '',
			month: '',
		};

		this.setDataNyt = this.setDataNyt.bind(this);
		this.handleArticleClick = this.handleArticleClick.bind(this);
		this.setYearAndMonth = this.setYearAndMonth.bind(this);
		this.refresh = this.refresh.bind(this);
	}
	
//handleArticleClick changes selectedArticle state so ArticleDetails component can return a preview
	handleArticleClick(item){
		this.setState({selectedArticle: item});
	}
			
	setYearAndMonth(y, m) {
		if (y<1851||y>2018||m<1||m>12){
			alert('These numbers seem wrong. Try again!');
			return
		}
		this.setState({year: y, month: m});
		this.refresh();
	}
	
//setDataNyt logs only first 20 results from NYT-API response
	setDataNyt(requestedData){
		let article = [];
		for(var i = 0; i <20; i++) {
			const doc = requestedData.response.docs[i];
			article.push(doc);
		}
		this.setState({data: article});
	}
	
//Method refresh makes HTTP GET request towards NYT-API if 'year' and 'month' requirements are met
	refresh(){
		if(!this.state.year || !this.state.month) {
			return;
		}
		$.ajax({
			url: 'https://api.nytimes.com/svc/archive/v1/' +  this.state.year + "/" + this.state.month + ".json",
			method: 'GET',
			data: {'api-key': "2ad417c011a6487eb5483e0b98c4d096"},
			success: this.setDataNyt
		});
	}

	render(){
		return (
			<div className='page'>
				<div className='container'>
					<ArticleResults selectionHandler={this.handleArticleClick} data={this.state.data}/>
				</div>
				<div className='details'>
					<ArticleDetails artc={this.state.selectedArticle}/>
				</div>
			</div>
		);
	}
}

//ArticleDetails builds a layout from props passed from App component's selectedArticle state
const ArticleDetails = (props) => {
	const artc = props.artc;
	return (
		<div className = 'sidebar'>
			<h1>{artc.headline.main}</h1>
			<li>ID: {artc._id}</li>
			<p>{artc.snippet}</p>
			<li>Published: {artc.pub_date.substr(0, 10)}</li>
			<li>Word count: {artc.word_count}</li>
			<br/>
			<a href={artc.web_url} target="_blank"> Read the whole article!</a>
		</div>
	);
}

//ArticleResults renders a grid of multiple Article objects
class ArticleResults extends React.Component {
	render() {
		const articles = this.props.data;
		const gridResults =
			<div className='previews'>
				{articles.map(
					(artc, index) => <Article key={index} item={artc} clickHandler={this.props.selectionHandler}/>
                )}
			</div>;
		return gridResults;
	}
}

//Article component renders data received from LinkPreview API
class Article extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			title: '',
			description: '',
			image: '',
			url: '',
			checkurl: ''
		};
           
		this.setDataLp = this.setDataLp.bind(this);
		this.refresh = this.refresh.bind(this);
	}
  
	setDataLp(requestedData){
		console.log(requestedData);
		let title = requestedData.title;
		let description = requestedData.description;
		let image = requestedData.image;
		this.setState({
			'title': title, 
			'description': description, 
			'image': image, 
			'checkurl':this.props.item.web_url
		});
	}
	
//Method refresh makes HTTP GET request towards LinkPreview API based on received URLs from NYT-API response
	refresh(){
		$.ajax({
			url:'https://api.linkpreview.net?key=5a9ad105c3a0b387ba2ba73ce1e4c81fb09175bf2a1f3&q=' + this.props.item.web_url,
			method: 'GET',
			success: this.setDataLp
		});
	}  

	componentDidMount(){
		this.refresh(); 
	} 
	
	componentDidUpdate(){  
		if (this.state.checkurl == this.props.item.web_url){
			return
		}
		this.refresh();  
	}
	
	render(){
		const artBlock = this.props.item;
		const clickHandler = this.props.clickHandler;
		const block =
			<div className='artCard' onClick={() => clickHandler(artBlock)}>
				<div className= 'artTitle'>{this.state.title}</div>
				<img src={this.state.image} className = 'artPicture'/>
				<div className= 'artDescription'>{this.state.description}</div>
			</div>;
		return block;
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
