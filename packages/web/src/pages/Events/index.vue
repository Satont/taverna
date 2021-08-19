<template>
  <div>
    <v-data-table
      :headers="headers"
      :items="items"
      :server-items-length="totalItems"
      :page.sync="page"
      :items-per-page="limit"
      class="elevation-1"
    >
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>Events</v-toolbar-title>
          <v-divider class="mx-4" inset vertical></v-divider>
          <v-spacer></v-spacer>
          <v-dialog v-model="dialog" max-width="800px">
            <template v-slot:activator="{ on, attrs }">
              <v-btn color="primary" dark class="mb-2" v-bind="attrs" @click="cleanEditedItem" v-on="on">Создать</v-btn>
            </template>
            <v-card>
              <v-form @submit.prevent="save">
                <v-card-title>
                  <span class="text-h5">{{ dialogTitle }}</span>
                </v-card-title>

                <v-card-text>
                  <v-container>
                    <v-row>
                      <v-col cols="6">
                        <v-text-field v-model="editedItem.name" :rules="['Required']" label="Имя" />
                      </v-col>
                      <v-col cols="6">
                        Статус:
                        <v-switch color="green" v-model="editedItem.active" :label="editedItem.active ? 'активный' : 'не активный'"
                      /></v-col>
                      <v-col cols="12">
                        <v-textarea v-model="editedItem.description" rows="3" :rules="['Required']" label="Описание" />
                      </v-col>
                      <v-row>
                        <v-col cols="12" sm="6" md="6">
                          <v-dialog
                            ref="dialog"
                            v-model="datePicker"
                            hide-overlay
                            persistent
                            width="290px"
                            @click:outside="datePicker = false"
                          >
                            <template v-slot:activator="{ on, attrs }">
                              <v-text-field
                                v-model="dateTime[0]"
                                label="Дата проведения (не обязательно)"
                                :prepend-icon="icons.mdiCalendar"
                                readonly
                                v-bind="attrs"
                                v-on="on"
                                clearable
                                :required="!!dateTime[1]"
                                @click:clear="dateTime[0] = null"
                                min-width="auto"
                              ></v-text-field>
                            </template>
                            <v-date-picker
                              :first-day-of-week="1"
                              :events="dataPickerEvents"
                              event-color="red"
                              v-model="dateTime[0]"
                              scrollable
                            >
                              <v-spacer></v-spacer>
                              <v-btn text color="green" @click="datePicker = false"> Сохранить </v-btn>
                            </v-date-picker>
                          </v-dialog>
                        </v-col>
                        <v-col cols="12" sm="6" md="6">
                          <v-dialog
                            ref="dialog"
                            v-model="timePicker"
                            hide-overlay
                            persistent
                            width="290px"
                            @click:outside="timePicker = false"
                          >
                            <template v-slot:activator="{ on, attrs }">
                              <v-text-field
                                v-model="dateTime[1]"
                                label="Время проведения (не обязательно)"
                                :prepend-icon="icons.mdiClock"
                                readonly
                                :required="!!dateTime[0]"
                                v-bind="attrs"
                                v-on="on"
                                clearable
                                @click:clear="dateTime[1] = null"
                              ></v-text-field>
                            </template>
                            <v-time-picker format="24hr" v-if="timePicker" v-model="dateTime[1]" full-width>
                              <v-spacer></v-spacer>
                              <v-btn text color="primary" @click="timePicker = false"> Сохранить </v-btn>
                            </v-time-picker>
                          </v-dialog>
                        </v-col>
                      </v-row>
                      <v-col cols="12">
                        <v-card class="mx-auto" tile>
                          <v-card-title
                            >Участники <v-spacer />
                            <v-btn color="light-blue" x-small @click.stop="showParticipantsModal = true">добавить</v-btn></v-card-title
                          >
                          <v-list three-line class="overflow-y-auto" max-height="200">
                            <template v-for="channel in editedItem.participants">
                              <v-list-item :key="channel.id">
                                <v-list-item-avatar>
                                  <v-img :src="getChannelFromStore(channel.id).logo"></v-img>
                                </v-list-item-avatar>

                                <v-list-item-content>
                                  <v-list-item-title v-html="channel.username"></v-list-item-title>
                                  <v-list-item-subtitle v-html="``"></v-list-item-subtitle>
                                </v-list-item-content>
                                <v-list-item-action>
                                  <v-btn icon>
                                    <v-icon color="grey lighten-1" @click="deleteParticipant(channel.id)">{{ icons.mdiTrashCan }}</v-icon>
                                  </v-btn>
                                </v-list-item-action>
                              </v-list-item>
                            </template>
                          </v-list>
                        </v-card>
                      </v-col>
                    </v-row>
                  </v-container>
                </v-card-text>

                <v-divider></v-divider>

                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="blue darken-1" text @click="cleanEditedItem">Закрыть</v-btn>
                  <v-btn color="teal darken-3" type="submit">{{ editedIndex === -1 ? 'Создать' : 'Сохранить' }}</v-btn>
                </v-card-actions>
              </v-form>
            </v-card>
          </v-dialog>
        </v-toolbar>
      </template>

      <template v-slot:[`item.authorName`]="{ item }">
        {{ item.author.username }}
      </template>

      <template v-slot:[`item.description`]="{ item }">
        {{ `${item.description.substring(0, 50)}${item.description.length > 50 ? '...' : ''}` }}
      </template>
      <template v-slot:[`item.active`]="{ item }">
        <v-chip :color="item.active ? 'green' : 'red'" dark>
          {{ item.active ? 'Активный' : 'Закрытый' }}
        </v-chip>
      </template>
      <template v-slot:[`item.date`]="{ item }">
        {{ item.date ? new Date(item.date).toLocaleString() : '' }}
      </template>
      <template v-slot:[`item.actions`]="{ item }">
        <v-btn :color="isParticipant(item) ? 'red' : 'green'" small class="mr-2" @click="switchParticipant(item)" :disabled="!item.active">
          {{ !isParticipant(item) ? 'Учавствовать' : 'Не учавствовать' }}
        </v-btn>
        <v-btn color="blue darken-1" small class="mr-2" @click="editItem(item)"
          ><v-icon>{{ icons.mdiInformation }}</v-icon></v-btn
        >
      </template>
    </v-data-table>

    <v-dialog v-model="showParticipantsModal" width="500" height="500">
      <v-card>
        <v-card-text>
          <v-list three-line class="overflow-y-auto" max-height="500">
            <v-list-item-group color="primary">
              <template v-for="channel in usersForParticipant">
                <v-list-item :key="channel._id" @click="addParticipant(channel)">
                  <v-list-item-avatar>
                    <v-img :src="channel.logo"></v-img>
                  </v-list-item-avatar>

                  <v-list-item-content>
                    <v-list-item-title v-html="channel.name"></v-list-item-title>
                    <v-list-item-subtitle v-html="``"></v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
              </template>
            </v-list-item-group>
          </v-list>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="showParticipantsModal = false">Закрыть</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { Event } from '@taverna/typeorm';
import api from '../../libs/api';
import { mdiCalendar, mdiClock, mdiInformation, mdiTrashCan } from '@mdi/js';
import { cloneDeep } from 'lodash';

@Component
export default class Events extends Vue {
  icons = {
    mdiCalendar,
    mdiClock,
    mdiInformation,
    mdiTrashCan,
  };
  headers: Array<{ text: string; value: string; sortable?: boolean }> = [
    {
      text: 'ID',
      value: 'id',
    },
    {
      text: 'Название',
      value: 'name',
    },
    {
      text: 'Автор',
      value: 'author.username',
    },
    {
      text: 'Описание',
      value: 'description',
    },
    {
      text: 'Участников',
      value: 'participants.length',
    },
    {
      text: 'Статус',
      value: 'active',
    },
    {
      text: 'Дата проведения',
      value: 'date',
    },
    { text: 'Действия', value: 'actions', sortable: false },
  ];
  items: Array<Event> = [];
  upcomingEvents: Array<Event> = [];
  limit = 20;
  page = 1;
  totalItems = 0;

  // everything related to modal
  dialog = false;
  editedIndex = -1;
  editedItem: Partial<Event> = {
    participants: [],
  };
  dateTime = [];
  datePicker = false;
  timePicker = false;

  showParticipantsModal = false;
  //usersForParticipant = [];

  cleanEditedItem() {
    this.editedIndex = -1;
    this.editedItem = { participants: [] };
    this.dateTime = [];
    this.datePicker = false;
    this.timePicker = false;
    this.dialog = false;
  }

  mounted() {
    this.getItems();
  }

  getChannelFromStore(id: string) {
    const meta = this.$store.state.meta;
    return meta.users.find((u) => u._id === id);
  }

  deleteParticipant(id: string) {
    this.editedItem.participants = this.editedItem.participants.filter((p) => p.id !== id);
  }

  get usersForParticipant() {
    const users = this.$store.state.meta.users;
    return users.filter((u) => !this.editedItem?.participants?.find((p) => p.id === u._id));
  }

  get dialogTitle() {
    return this.editedIndex === -1 ? 'Новый ивент' : this.editedItem.name;
  }

  editItem(item: Event) {
    this.editedIndex = this.items.indexOf(item);
    this.editedItem = cloneDeep(item);

    if (item.date) {
      const date = new Date(item.date);
      const [year, month, day, hour, minute] = [
        date.getFullYear(),
        date.getUTCMonth() + 1,
        date.getDate(),
        date.getHours() + 1,
        date.getMinutes() + 1,
      ];
      this.dateTime = [`${year}-${month}-${day}`, `${hour}:${minute}`];
    }
    this.dialog = true;
  }

  isParticipant(item: Event) {
    return item.participants.some((p) => p.id === this.$store.state.user.id);
  }

  addParticipant(channel: { _id: string; name: string }) {
    this.editedItem.participants.push({ id: channel._id, username: channel.name, online: false } as any);
  }

  async getItems() {
    const request = await api.get(`events?limit=${this.limit}&page=${this.page}`);
    this.items = request.data;
    this.totalItems = Number(request.headers['x-total']);
    const upcomingRequest = await api.get<Event[]>('events/upcoming');
    this.upcomingEvents = upcomingRequest.data;
  }

  async switchParticipant(item: Event) {
    if (item.participants.some((p) => p.id === this.$store.state.user.id)) {
      await api.post(`events/${item.id}/part`);
      item.participants = item.participants.filter((p) => p.id !== this.$store.state.user.id);
    } else {
      await api.post(`events/${item.id}/join`);
      const user = this.$store.state.user;
      item.participants.push({ id: user.id, username: user.login } as any);
    }
  }

  async save() {
    const date = this.dateTime.length ? new Date(this.dateTime.join(' ')) : null;
    const method = this.editedIndex === -1 ? 'post' : 'patch';

    await api[method]<Event>(`events`, {
      ...this.editedItem,
      date,
    });
    await this.getItems();
    this.cleanEditedItem();
  }

  get dataPickerEvents() {
    return this.upcomingEvents
      .filter((e) => e.date)
      .map((item) => {
        return new Date(item.date).toISOString().substr(0, 10);
      });
  }
}
</script>
