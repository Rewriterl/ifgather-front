<template>
  <div class="container">
    <Breadcrumb :items="['menu.scan', 'searchTable.search.banalyze']" />
    <a-card class="general-card" :title="$t('searchTable.search.banalyze')">
      <a-row>
        <a-col :flex="1">
          <a-form
            :model="formModel"
            :label-col-props="{ span: 6 }"
            :wrapper-col-props="{ span: 18 }"
            label-align="left"
          >
            <a-row>
              <a-col :span="12">
                <a-form-item
                  field="searchParams"
                  :label="$t('searchTable.fingerprint.name')"
                >
                  <a-input
                    v-model="formModel.searchParams.key"
                    :placeholder="$t('searchTable.fingerprint.name')"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="12">
                <a-form-item
                  field="searchParams"
                  :label="$t('searchTable.fingerprint.description')"
                >
                  <a-input
                    v-model="formModel.searchParams.description"
                    :placeholder="$t('searchTable.fingerprint.description')"
                  />
                </a-form-item>
              </a-col>
            </a-row>
          </a-form>
        </a-col>
        <a-divider style="height: 44px" direction="vertical" />
        <a-col :flex="'86px'" style="text-align: right">
          <a-space direction="horizontal" :size="18">
            <a-button type="primary" @click="search">
              <template #icon>
                <icon-search />
              </template>
              {{ $t('searchTable.form.search') }}
            </a-button>
            <a-button @click="reset">
              <template #icon>
                <icon-refresh />
              </template>
              {{ $t('searchTable.form.reset') }}
            </a-button>
          </a-space>
        </a-col>
      </a-row>
      <a-divider style="margin-top: 0" />
      <a-row style="margin-bottom: 16px">
        <a-col :span="12"> </a-col>
        <a-col
          :span="12"
          style="display: flex; align-items: center; justify-content: end"
        >
          <a-tooltip :content="$t('searchTable.actions.importBanalyze')">
            <div class="action-icon">
              <a-upload :custom-request="batchUpload" />
            </div>
          </a-tooltip>
          <a-tooltip :popup-visible="false">
            <div class="action-icon">
              <a-popconfirm content="真删？" @ok="delAll">
                <a-button :status="'danger'">清除全部</a-button>
              </a-popconfirm>
            </div>
          </a-tooltip>
          <a-tooltip :content="$t('searchTable.actions.addBanalyze')">
            <div class="action-icon" @click="addFingerprint">
              <icon-plus size="18" />
            </div>
          </a-tooltip>
          <a-tooltip :content="$t('searchTable.actions.refresh')">
            <div class="action-icon" @click="search">
              <icon-refresh size="18" />
            </div>
          </a-tooltip>
          <a-dropdown @select="handleSelectDensity">
            <a-tooltip :content="$t('searchTable.actions.density')">
              <div class="action-icon">
                <icon-line-height size="18" />
              </div>
            </a-tooltip>
            <template #content>
              <a-doption
                v-for="item in densityList"
                :key="item.value"
                :value="item.value"
                :class="{ active: item.value === size }"
              >
                <span>{{ item.name }}</span>
              </a-doption>
            </template>
          </a-dropdown>
          <a-tooltip :content="$t('searchTable.actions.columnSetting')">
            <a-popover
              trigger="click"
              position="bl"
              @popup-visible-change="popupVisibleChange"
            >
              <div class="action-icon">
                <icon-settings size="18" />
              </div>
              <template #content>
                <div id="tableSetting">
                  <div
                    v-for="(item, index) in showColumns"
                    :key="item.dataIndex"
                    class="setting"
                  >
                    <div style="margin-right: 4px; cursor: move">
                      <icon-drag-arrow />
                    </div>
                    <div>
                      <a-checkbox
                        v-model="item.checked"
                        @change="
                          handleChange($event, item as TableColumnData, index)
                        "
                      >
                      </a-checkbox>
                    </div>
                    <div class="title">
                      {{ item.title === '#' ? '序列号' : item.title }}
                    </div>
                  </div>
                </div>
              </template>
            </a-popover>
          </a-tooltip>
        </a-col>
      </a-row>
      <a-table
        row-key="id"
        :loading="loading"
        :pagination="pagination"
        :columns="(cloneColumns as TableColumnData[])"
        :data="renderData"
        :bordered="false"
        :size="size"
        @page-change="onPageChange"
      >
        <template #description="{ record }">
          <a-typography-paragraph
            :ellipsis="{
              rows: 2,
              showTooltip: true,
            }"
          >
            {{ record.description }}
          </a-typography-paragraph>
        </template>
        <template #operations="{ record }">
          <a-button
            type="text"
            size="small"
            :shape="'square'"
            :status="'normal'"
            @click="handleDetailsClick(record.key)"
          >
            查看详情
          </a-button>
          <a-popconfirm
            :type="'warning'"
            content="真删？"
            @ok="delOne(record.key)"
          >
            <a-button
              type="text"
              :shape="'square'"
              size="small"
              :status="'danger'"
            >
              删除
            </a-button>
          </a-popconfirm>
        </template>
      </a-table>
      <a-modal
        v-model:visible="visible"
        title="添加指纹"
        @cancel="handleCancel"
      >
        <a-form :model="form">
          <a-form-item field="ba" label="指纹">
            <a-textarea
              :disabled="true"
              placeholder="此接口暂时弃用"
              v-model="form.ba"
            />
          </a-form-item>
        </a-form>
      </a-modal>
    </a-card>
  </div>
</template>

<script lang="ts" setup>
  import { computed, ref, reactive, watch, nextTick } from 'vue';
  import { useI18n } from 'vue-i18n';
  import useLoading from '@/hooks/loading';
  import { Params, LoginLogRecord } from '@/api/manager';
  import { Pagination } from '@/types/global';
  import type { TableColumnData } from '@arco-design/web-vue/es/table/interface';
  import cloneDeep from 'lodash/cloneDeep';
  import Sortable from 'sortablejs';
  import {
    addBanalyze,
    batchUploadBanalyze,
    delAllBanalyze,
    delBanalyze,
    getBanalyzeList,
  } from '@/api/fingerprint';
  import { Message } from '@arco-design/web-vue';

  type SizeProps = 'mini' | 'small' | 'medium' | 'large';
  type Column = TableColumnData & { checked?: true };

  const generateFormModel = () => {
    return {
      searchParams: {
        key: '',
        description: '',
      },
    };
  };
  const { loading, setLoading } = useLoading(true);
  const { t } = useI18n();
  const renderData = ref<LoginLogRecord[]>([]);
  const formModel = ref(generateFormModel());
  const cloneColumns = ref<Column[]>([]);
  const showColumns = ref<Column[]>([]);

  const size = ref<SizeProps>('medium');

  const basePagination: Pagination = {
    page: 1,
    limit: 10,
  };
  const pagination = reactive({
    ...basePagination,
  });
  const densityList = computed(() => [
    {
      name: t('searchTable.size.mini'),
      value: 'mini',
    },
    {
      name: t('searchTable.size.small'),
      value: 'small',
    },
    {
      name: t('searchTable.size.medium'),
      value: 'medium',
    },
    {
      name: t('searchTable.size.large'),
      value: 'large',
    },
  ]);
  const columns = computed<TableColumnData[]>(() => [
    {
      title: t('searchTable.columns.id'),
      dataIndex: 'id',
    },
    {
      title: t('searchTable.fingerprint.name'),
      dataIndex: 'key',
    },
    {
      title: t('searchTable.fingerprint.description'),
      dataIndex: 'description',
      slotName: 'description',
    },
    {
      title: t('searchTable.columns.createdTime'),
      dataIndex: 'create_at',
    },
    {
      title: t('searchTable.columns.operations'),
      dataIndex: 'operations',
      slotName: 'operations',
    },
  ]);
  const fetchData = async (
    params: Params = { page: 1, limit: 10, searchParams: '' }
  ) => {
    setLoading(true);
    try {
      const data: any = await getBanalyzeList(params);
      renderData.value = data.data;
      pagination.page = params.page;
      pagination.total = data.count;
    } catch (err) {
      // you can report use errorHandler or other
    } finally {
      setLoading(false);
    }
  };

  const search = () => {
    const searchParams = JSON.stringify(formModel.value.searchParams);
    fetchData({
      ...basePagination,
      searchParams,
    } as unknown as Params);
  };

  const addFingerprint = () => {
    visible.value = true;
  };

  const onPageChange = (page: number) => {
    fetchData({ ...basePagination, page });
  };

  fetchData();
  const reset = () => {
    formModel.value = generateFormModel();
  };

  const handleSelectDensity = (
    val: string | number | Record<string, any> | undefined,
    e: Event
  ) => {
    size.value = val as SizeProps;
  };

  const handleChange = (
    checked: boolean | (string | boolean | number)[],
    column: Column,
    index: number
  ) => {
    if (!checked) {
      cloneColumns.value = showColumns.value.filter(
        (item) => item.dataIndex !== column.dataIndex
      );
    } else {
      cloneColumns.value.splice(index, 0, column);
    }
  };

  const exchangeArray = <T extends Array<any>>(
    array: T,
    beforeIdx: number,
    newIdx: number,
    isDeep = false
  ): T => {
    const newArray = isDeep ? cloneDeep(array) : array;
    if (beforeIdx > -1 && newIdx > -1) {
      // 先替换后面的，然后拿到替换的结果替换前面的
      newArray.splice(
        beforeIdx,
        1,
        newArray.splice(newIdx, 1, newArray[beforeIdx]).pop()
      );
    }
    return newArray;
  };

  const popupVisibleChange = (val: boolean) => {
    if (val) {
      nextTick(() => {
        const el = document.getElementById('tableSetting') as HTMLElement;
        const sortable = new Sortable(el, {
          onEnd(e: any) {
            const { oldIndex, newIndex } = e;
            exchangeArray(cloneColumns.value, oldIndex, newIndex);
            exchangeArray(showColumns.value, oldIndex, newIndex);
          },
        });
      });
    }
  };

  const batchUpload = async (option: any) => {
    setLoading(true);
    const { fileItem } = option;
    const formData = new FormData();
    formData.append('data', fileItem.file);
    try {
      const data: any = await batchUploadBanalyze(formData);
      await fetchData();
      Message.success(data.msg);
    } finally {
      setLoading(false);
    }
  };

  const delOne = async (key: string) => {
    setLoading(true);
    try {
      const data: any = await delBanalyze(key);
      await fetchData();
      Message.success(data.msg);
    } catch (err) {
      // you can report use errorHandler or other
    } finally {
      setLoading(false);
    }
  };

  const delAll = async () => {
    setLoading(true);
    try {
      const data: any = await delAllBanalyze();
      await fetchData();
      Message.success(data.msg);
    } catch (err) {
      // you can report use errorHandler or other
    } finally {
      setLoading(false);
    }
  };

  const visible = ref(false);
  const form = reactive({
    ba: '',
  });
  const clearForm = () => {
    form.ba = '';
  };
  const handleCancel = () => {
    visible.value = false;
    clearForm();
  };

  const addOne = async () => {
    setLoading(true);
    try {
      const data: any = await addBanalyze(form.ba);
      await fetchData();
      Message.success(data.msg);
    } catch (err) {
      // you can report use errorHandler or other
    } finally {
      setLoading(false);
    }
  };

  const handleBeforeOk = (done: any) => {
    addOne();
    fetchData();
    clearForm();
    done();
  };

  watch(
    () => columns.value,
    (val) => {
      cloneColumns.value = cloneDeep(val);
      cloneColumns.value.forEach((item, index) => {
        item.checked = true;
      });
      showColumns.value = cloneDeep(cloneColumns.value);
    },
    { deep: true, immediate: true }
  );
</script>

<script lang="ts">
  export default {
    name: 'Port',
  };
</script>

<style scoped lang="less">
  .container {
    padding: 0 20px 20px 20px;
  }

  :deep(.arco-table-th) {
    &:last-child {
      .arco-table-th-item-title {
        margin-left: 16px;
      }
    }
  }

  .action-icon {
    margin-left: 12px;
    cursor: pointer;
  }

  .active {
    color: #0960bd;
    background-color: #e3f4fc;
  }

  .setting {
    display: flex;
    align-items: center;
    width: 200px;

    .title {
      margin-left: 12px;
      cursor: pointer;
    }
  }
</style>
