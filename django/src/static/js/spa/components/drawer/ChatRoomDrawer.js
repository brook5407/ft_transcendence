import { ajaxWithAuth } from '../../ajax.js';
import { Component } from '../Component.js';

/**
 * @typedef {Object} Message
 * @property {string} [type] - The message type, group or private (optional).
 * @property {string} message - The message content.
 * @property {Sender} sender - The sender of the message.
 * @property {string} room_id - The ID of the room.
 * @property {string} room_name - The name of the room.
 * @property {string} [cover_image] - The cover image of the room (optional).
 */

/**
 * @typedef {Object} Sender
 * @property {string} username - The username of the sender.
 * @property {string} nickname - The nickname of the sender.
 * @property {string} avatar - The avatar url of the sender.
 */

export class ChatRoomDrawer extends Component {
	constructor(params) {
		super(params);

		this.room_id = this.queryParams.room_id;

		this.boundHandleChatRoomDrawerOpened =
			this.handleChatRoomDrawerOpened.bind(this);

		this.spinnerHTML = `
			<div class="spinner-border text-primary" role="status">
				<span class="sr-only">Loading...</span>
			</div>
		`;
		this.spinnerElement = null;
		this.chatMessagesContainer = null;

		this.nextPage = 1;
		this.stillHasNextPage = true;
		this.renderingHistoryMessage = false;
	}

	async fetchNextPageHistoryMessages() {
		const res = await ajaxWithAuth(`/api/chat/${this.room_id}/history/`, {
			method: 'GET',
			params: {
				page: this.nextPage,
			},
		});

		if (!res.ok) {
			return [];
		}

		const data = await res.json();
		this.nextPage++;
		if (!data.next) {
			this.stillHasNextPage = false;
		}
		return data.results;
	}

	async renderNextPageMessages() {
		this.renderingHistoryMessage = true;

		/** @type {Message[]} */
		const messages = await this.fetchNextPageHistoryMessages();
		console.log(messages);
		this.hideLoadingSpinner();

		messages.forEach((message) => {
			this.prependMessage(message);
		});

		this.renderingHistoryMessage = false;
	}

	showLoadingSpinner() {
		this.spinnerElement = document.createElement('div');
		this.spinnerElement.id = 'loading-spinner';
		this.spinnerElement.innerHTML = this.spinnerHTML;
		this.chatMessagesContainer.prepend(this.spinnerElement);
	}

	hideLoadingSpinner() {
		if (!this.spinnerElement) {
			return;
		}
		this.spinnerElement.remove();
		this.spinnerElement = null;
	}

	async handleChatRoomDrawerOpened(e) {
		if (e.detail.drawerName !== 'chat-room') {
			return;
		}
		this.chatMessagesContainer = this.element.querySelector('#chat-messages');
		this.showLoadingSpinner();
		await this.renderNextPageMessages();
		this.scrollToBottom();
		this.chatMessagesContainer.addEventListener('wheel', () => {
			if (
				!this.renderingHistoryMessage &&
				this.chatMessagesContainer.scrollTop <= 0
			) {
				this.showLoadingSpinner();
				if (!this.stillHasNextPage) {
					this.hideLoadingSpinner();
					return;
				}
				this.renderNextPageMessages();
			}
		});

		const chatInput = this.element.querySelector('#message-input');
		const sendMessage = () => {
			const message = chatInput.value;
			if (!message) {
				return;
			}
			chatInput.value = '';
			window.chatController.sendMessage(message, this.room_id);
		};

		chatInput.addEventListener('keydown', (e) => {
			if (e.key === 'Enter') {
				e.preventDefault();
				sendMessage();
			}
		});

		const sendButton = this.element.querySelector('#send-button');
		sendButton.addEventListener('click', sendMessage);
	}

	/**
	 *
	 * @param {string} message
	 * @returns {HTMLDivElement}
	 */
	createMessageElement(message) {
		const messageElem = document.createElement('div');
		messageElem.classList.add('chat-room__message');
		if (message.sender.nickname === currentUser.profile.nickname) {
			messageElem.classList.add('chat-room__message-sent');
		} else {
			messageElem.classList.add('chat-room__message-received');
		}

		const avatarContainer = document.createElement('div');
		avatarContainer.classList.add('chat-room__avatar-container');

		const avatarElem = document.createElement('img');
		avatarElem.src = message.sender.avatar;
		avatarElem.alt = `${message.sender.nickname}'s avatar`;
		avatarElem.classList.add('chat-room__avatar');

		const nicknameElem = document.createElement('span');
		nicknameElem.textContent = message.sender.nickname;
		nicknameElem.classList.add('chat-room__nickname');

		const bubbleElem = document.createElement('div');
		bubbleElem.textContent = message.message;
		bubbleElem.classList.add('chat-room__message-bubble');

		avatarContainer.appendChild(nicknameElem);
		avatarContainer.appendChild(avatarElem);

		messageElem.appendChild(avatarContainer);
		messageElem.appendChild(bubbleElem);

		return messageElem;
	}

	/**
	 *
	 * @param {Message} message
	 * @returns
	 */
	prependMessage(message) {
		if (!this.chatMessagesContainer) {
			return;
		}
		const messageElem = this.createMessageElement(message);
		this.chatMessagesContainer.prepend(messageElem);
	}

	/**
	 *
	 * @param {Message} message
	 * @returns
	 */
	appendMessage(message) {
		if (!this.chatMessagesContainer) {
			return;
		}
		const messageElem = this.createMessageElement(message);
		this.chatMessagesContainer.appendChild(messageElem);
		this.scrollToBottom();
	}

	scrollToBottom() {
		// scroll to bottom
		this.chatMessagesContainer.scrollTo({
			top: this.chatMessagesContainer.scrollHeight,
			behavior: 'smooth',
		});
	}

	// override
	async initComponent() {
		document.addEventListener(
			'drawer-opened',
			this.boundHandleChatRoomDrawerOpened
		);
	}

	// override
	destroy() {
		super.destroy();
		document.removeEventListener(
			'drawer-opened',
			this.boundHandleChatRoomDrawerOpened
		);
	}

	template() {
		return `
			<div>
				<h1>Drawer</h1>
			</div>
		`;
	}
}
