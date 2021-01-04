// Switch to tab menu
document.getElementById("review").addEventListener('click', function () {
    document.getElementById("homeBlog").style.cssText = 'display:flex;';
    document.getElementById("write-your-blog").style.cssText = 'display:none;';
    document.getElementById("blogDetails").style.cssText = 'display:none;';
})
document.getElementById("home").addEventListener('click', function () {
    document.getElementById("homeBlog").style.cssText = 'display:flex;';
    document.getElementById("write-your-blog").style.cssText = 'display:none;';
    document.getElementById("blogDetails").style.cssText = 'display:none;';
})

document.getElementById("blog").addEventListener('click', function () {
    document.getElementById("write-your-blog").style.cssText = 'display:block;';
    document.getElementById("homeBlog").style.cssText = 'display:none;';
    document.getElementById("blogDetails").style.cssText = 'display:none;';
})

// Write a blog
let globalId;
let blogger = [];
const formSubmitButton = document.getElementById("formSubmission");

const submitData = (event) => {
    event.preventDefault(); // To stop the form Submitting
    let formValue = {
        "blogTitle": document.getElementById("btitle_ip").value,
        "writer": document.getElementById("blog-owner_ip").value,
        "content": document.getElementById("content_ip").value,
        "blogImage": document.getElementById("img_ip").value,
        "publisher": document.getElementById("publisher_ip").value
    }
    blogger.push(formValue);
    localStorage.setItem("newBlog", JSON.stringify(blogger, null, '\t'));
    document.querySelector('form').reset()
}
formSubmitButton.addEventListener("click", submitData);
// Read from a file
let blogCard;
let setId;

// function maDataToReplySection(blogID, index) {
//     console.log(blogID)
//     let showCommentsElement = document.getElementById("showComments");
//     if(showCommentsElement.hasChildNodes()) {
//         while ((document.getElementById('replyComment') && document.getElementById('replyComment').parentElement.firstChild)) {
//             showCommentsElement.removeChild(document.getElementById('replyComment').parentElement.firstChild);
//         }
//     }
//     JSON.parse(localStorage.getItem('parentComments')).map((value)=> {
//         if (value.bid == blogID ) {
//             console.log(value.parentComments);
//             var newElement = document.createElement("strong");
//              newElement.setAttribute('id','replyComment');
//             var elementText = document.createTextNode(value.parentComments);
//             newElement.appendChild(elementText);
//             showCommentsElement.appendChild(newElement)
//             var replyForm = document.createElement("textarea");
//             replyForm.setAttribute('class','yournewReply');
//             replyForm.setAttribute('placeholder','Write a Comment...');
//             var replyBtn = document.createElement("button");
//             replyBtn.setAttribute('class','replyButton');
//             replyBtn.setAttribute('type','submit');
//             var buttonValue = document.createTextNode("Reply");
//             replyBtn.appendChild(buttonValue);
//             showCommentsElement.appendChild(replyForm);
//             showCommentsElement.appendChild(replyBtn);
//         }
//     });
// };
fetch("index.json")
    .then(response => response.json())
    .then(val => {
        var outputHTML = "";
        val.forEach((value, i) => {
            // Display blocks on home page 
            outputHTML += `<div data-id=${value.id} class="grid-item homeblogData" style="background-color:rgb(248, 248, 248);">
            <strong id="btitle">${value.blogTitle} </strong><br>
            <span id="bowner" class="blog-owner"> -${value.writer}</span><br><br><br><br> <hr>
            <span id="bpublisher" class="publisher">${value.publisher}</span>
            </div>`
        });
        document.getElementById("homeBlog").innerHTML = outputHTML;
        blogCard = document.getElementsByClassName("homeblogData");
        // Blog Details Page
        setId = document.getElementsByClassName("card")[0];
        // fetch & show data from JSON file         
        for (let i = 0; i < blogCard.length; i++) {
            blogCard[i].addEventListener("click", () => {
                console.log(blogCard[i].dataset.id);
                setId.setAttribute("id", blogCard[i].dataset.id)
                document.getElementById("blogDetailsTitle").innerHTML = val[i].blogTitle;
                document.getElementById("blogDetailsWriter").innerHTML = val[i].writer;
                document.getElementById("blogDetailsContent").innerHTML = val[i].content;
                document.getElementById("blogDetailsImage").setAttribute('src', val[i].blogImage);
                document.getElementById("blogDetailsPublisher").innerHTML = val[i].publisher;
                document.getElementById("homeBlog").style.cssText = 'display:none;';
                document.getElementById("blogDetails").style.cssText = 'display:block;';
                //mapDataToReplySection(blogCard[i].dataset.id, i);
                globalId =blogCard[i].dataset.id;
                renderComments();
            });
        }
    });

// Blog Details Page (Comments)

// let comments = [];
// const parentCommentsButton = document.getElementById("parentComments");

// const postComments = (event) => {
//     event.preventDefault(); // To stop the form Submitting
//     let formValue = {
//         "bid": document.getElementsByClassName("card")[0].getAttribute("id"),
//         "parentComments": document.getElementById("comments").value
//     }
//     comments.push(formValue);
//     localStorage.setItem("parentComments", JSON.stringify(comments, null, '\t'));
//     document.getElementsByClassName('userCommentForm')[0].reset();
// }
// parentCommentsButton.addEventListener("click", postComments);

// let commentValue = JSON.parse(localStorage.getItem('parentComments'));
// console.log(commentValue);

let commentSection = new Array();

// Fetch Comment data from localStorage if exists
(() => {
    let commentString = localStorage.getItem("commentSection");
    if (commentString !== null) {
        commentSection = JSON.parse(commentString);
        for (let i = 0; i < commentSection.length; i++) {
            commentSection[i].childrenIds = JSON.parse(commentSection[i].childrenIds); // converting string back to array form
        }
    }
})();


document.addEventListener('DOMContentLoaded', (params) => {
    if (commentSection.length) {
        renderComments();
    }

    const addButton = document.getElementById("parentComments");
    addButton.addEventListener("click", () => {
        let name = document.getElementById("name").value;
        let content = document.getElementById("comment").value;
        let presentBlogId = document.getElementsByClassName("card")[0].getAttribute("id");
        addComment(name, content, null, presentBlogId);
    }, false)
    const commentsList = document.getElementById("showComments");
    commentsList.addEventListener("click", (event) => {
        if (event.target.nodeName === 'A' || event.target.nodeName === 'BUTTON') {
            let parts = event.target.id.split("-");
            let type = parts[0];
            let id = parts[parts.length - 1];
            let val = event.target.id.split("reply-")[1];
            if (type == 'reply') {
                let inputElement = `
                    <li id="input-${val}">
                    <div class="comment-input-row">
						<div>
							<input type="text" placeholder="Name" id="name-${val}" class="name-handle" />
						</div>
                    </div>
                    <div>
						<textarea rows="5" id="content-${val}" class="comment-box" placeholder="Your reply...."></textarea>
						<div>
							<button id="addreply-${val}" class="add-btn">Submit</button>
						</div>
					</div>
					</li>
                `;
                let childListElemId = `childlist-${event.target.id.split("reply-")[1]}`;
                let childListElem = document.getElementById(childListElemId);

                if (childListElem == null) {
                    childListElem = `<ul id="childlist-${event.target.id.split("reply-")[1]}"> ${inputElement} </ul>`;
                    document.getElementById(`comment-${val}`).innerHTML += childListElem;
                } else {
                    childListElem.innerHTML = inputElement + childListElem.innerHTML;
                }
            } else if (type == 'addreply') {
                let content = document.getElementById(`content-${val}`).value;
                let name = document.getElementById(`name-${val}`).value;
                let currentBlogId = document.getElementsByClassName("card")[0].getAttribute("id");
                addComment(name, content, id, currentBlogId);
            }
        }
    }, false);
}, false);

// Store Comment Data to localStorage
let storeComments = () => {
    let str = "[";
    for (let i in commentSection) {
        str += Comment.toJSONString(commentSection[i]);
        (i != commentSection.length - 1) ? str += "," : str += "";
    }
    str += "]";
    localStorage.setItem('commentSection', str);
}

let renderComment = (comment) => {
    let id = comment.id;
    let listElements = `
            
            <li id="comment-${id}">
            <div class="comment-header">
				<div  class="comment-name">
					${comment.name}
				</div>
			</div> 
			<div class="comment-content">
			 ${comment.content}
            </div>
            <div>
				<a href="#" role="button" id="reply-${id}" class="child-reply">Reply</a>
            </div><br>`;
    if (comment.childrenIds.length != 0) {
        listElements += `<ul id="childlist-${id}">`
        comment.childrenIds.forEach(commentId => {
            // recursive call inorder to handle nesting of child elements(grand child).
            listElements += renderComment(commentSection[commentId])
        });
        listElements += "</ul>";
    }
    listElements += "</li>";
    return listElements;
}
// pass parent comment from rootComments to renderComment
let renderComments = () => {
    let rootComments = [];
    commentSection.forEach(comment => {
        // parent comment pushed to rootcomment
        if (comment.parentId === null || comment.parentId == "null") {// && comment.blogId=== thisBlogId) {
            rootComments.push(comment);
        }
    });
    let commentList = '';
    rootComments.forEach(comment => {
        // Appending all Parents
        if(comment.blogId === globalId) {
            commentList += renderComment(comment);
        }
    });
    document.getElementById("showComments").innerHTML = commentList;
}

// Adding new comment to memory and UI
let addComment = (name, content, parent, blogId) => {
    let comment = new Comment(commentSection.length, name, content, parent, blogId)
    document.getElementsByClassName('userCommentForm')[0].reset();
    commentSection.push(comment);
    if (parent != null) {
        commentSection[parent].childrenIds.push(commentSection.length - 1);
    }
    storeComments();
    renderComments();
}

class Comment {
    constructor(id, name, content, parentId, blogId) {
        this.id = id;
        this.name = name;
        this.content = content;
        this.childrenIds = [];
        this.parentId = parentId;
        this.blogId = blogId;
    }
    // JSON Strig will send/Save data on LocalStorage
    static toJSONString(comment) {
        return `{            
            "id" : "${comment.id}",
            "name" : "${comment.name}",
            "content" : "${comment.content}",
            "parentId" : "${comment.parentId}",
            "childrenIds" : "${JSON.stringify(comment.childrenIds)}",         
            "blogId" : "${comment.blogId}"
        }`;
    }
}